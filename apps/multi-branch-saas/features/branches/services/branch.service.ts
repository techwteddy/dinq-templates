import { BranchType } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getAccessibleBranchIds } from '@/lib/rbac'
import {
  withoutDeleted,
  softDelete,
  createAuditData,
  updateAuditData,
} from '@/lib/utils/prisma-helpers'
import { getCurrentUser } from '@/features/auth/utils'
import type {
  BranchListItem,
  BranchDetail,
  BranchHierarchyItem,
  CreateBranchInput,
  UpdateBranchInput,
  BranchFilters,
} from '../types'

/**
 * Get all branches with filters
 */
export async function getBranches(filters: BranchFilters = {}): Promise<BranchListItem[]> {
  try {
    const { search, type, isActive, parentId } = filters

    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    // Build where clause with soft delete filter
    const where: any = withoutDeleted({
      id: {
        in: accessibleBranchIds,
      },
      ...(type && { type }),
      ...(isActive !== undefined && { isActive }),
      ...(parentId !== undefined && { parentId }),
    })

    // Add search filter
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const branches = await prisma.branch.findMany({
      where,
      include: {
        _count: {
          select: {
            children: true,
            profiles: true,
          },
        },
      },
      orderBy: [
        { type: 'asc' }, // HQ first, then BRANCH, then SUB_BRANCH
        { name: 'asc' },
      ],
    })

    return branches as BranchListItem[]
  } catch (error) {
    console.error('Error getting branches:', error)
    throw new Error('Failed to fetch branches')
  }
}

/**
 * Get branches in hierarchy structure (tree)
 */
export async function getBranchesHierarchy(): Promise<BranchHierarchyItem[]> {
  try {
    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    // Get all accessible branches (filter soft-deleted)
    const branches = await prisma.branch.findMany({
      where: withoutDeleted({
        id: {
          in: accessibleBranchIds,
        },
      }),
      include: {
        _count: {
          select: {
            profiles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Build hierarchy
    const buildHierarchy = (parentId: string | null): BranchHierarchyItem[] => {
      return branches
        .filter(branch => branch.parentId === parentId)
        .map(branch => ({
          id: branch.id,
          name: branch.name,
          code: branch.code,
          type: branch.type,
          parentId: branch.parentId,
          isActive: branch.isActive,
          _count: branch._count,
          children: buildHierarchy(branch.id),
        }))
    }

    // Find top-most accessible branches (branches whose parents are not in accessible list)
    const accessibleBranchIdSet = new Set(accessibleBranchIds)
    const topBranches = branches.filter(
      branch => !branch.parentId || !accessibleBranchIdSet.has(branch.parentId)
    )

    // Build hierarchy from each top branch
    return topBranches.map(branch => ({
      id: branch.id,
      name: branch.name,
      code: branch.code,
      type: branch.type,
      parentId: branch.parentId,
      isActive: branch.isActive,
      _count: branch._count,
      children: buildHierarchy(branch.id),
    }))
  } catch (error) {
    console.error('Error getting branch hierarchy:', error)
    throw new Error('Failed to fetch branch hierarchy')
  }
}

/**
 * Get branch by ID
 */
export async function getBranchById(branchId: string): Promise<BranchDetail | null> {
  try {
    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    if (!accessibleBranchIds.includes(branchId)) {
      throw new Error('Branch not accessible')
    }

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        profiles: {
          select: {
            id: true,
            fullName: true,
            status: true,
          },
          take: 10, // Limit to prevent large response
          orderBy: {
            fullName: 'asc',
          },
        },
      },
    })

    return branch as BranchDetail | null
  } catch (error) {
    console.error('Error getting branch:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch branch')
  }
}

/**
 * Create new branch
 */
export async function createBranch(data: CreateBranchInput): Promise<BranchDetail> {
  try {
    const { name, code, type, parentId, address, phone, email, isActive } = data

    // Check if code already exists
    const existingBranch = await prisma.branch.findUnique({
      where: { code },
    })

    if (existingBranch) {
      throw new Error('Branch code already exists')
    }

    // Validate parent branch if provided
    if (parentId) {
      const accessibleBranchIds = await getAccessibleBranchIds()
      if (!accessibleBranchIds.includes(parentId)) {
        throw new Error('Parent branch not accessible')
      }

      const parentBranch = await prisma.branch.findUnique({
        where: { id: parentId },
      })

      if (!parentBranch) {
        throw new Error('Parent branch not found')
      }

      // Validate branch type hierarchy
      // HQ cannot have parent
      if (type === BranchType.HEADQUARTERS) {
        throw new Error('Headquarters cannot have a parent branch')
      }

      // BRANCH should have HQ as parent
      if (type === BranchType.BRANCH && parentBranch.type !== BranchType.HEADQUARTERS) {
        throw new Error('Branch must have Headquarters as parent')
      }

      // SUB_BRANCH should have BRANCH as parent
      if (type === BranchType.SUB_BRANCH && parentBranch.type !== BranchType.BRANCH) {
        throw new Error('Sub-branch must have Branch as parent')
      }
    } else {
      // Only HQ can be without parent
      if (type !== BranchType.HEADQUARTERS) {
        throw new Error('Only Headquarters can be created without a parent')
      }
    }

    // Validate HQ uniqueness - only one active HQ allowed
    if (type === BranchType.HEADQUARTERS) {
      const existingHQ = await prisma.branch.findFirst({
        where: withoutDeleted({
          type: BranchType.HEADQUARTERS,
        }),
      })

      if (existingHQ) {
        throw new Error('Only one headquarters is allowed. An active headquarters already exists.')
      }
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    const profileId = currentUser?.profile.id

    // Create branch
    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        type,
        parentId: parentId || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        isActive: isActive !== undefined ? isActive : true,
        ...createAuditData(profileId),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        profiles: {
          select: {
            id: true,
            fullName: true,
            status: true,
          },
        },
      },
    })

    return branch as BranchDetail
  } catch (error) {
    console.error('Error creating branch:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create branch')
  }
}

/**
 * Update branch
 */
export async function updateBranch(
  branchId: string,
  data: UpdateBranchInput
): Promise<BranchDetail> {
  try {
    const { name, code, type, parentId, address, phone, email, isActive } = data

    // Check if branch exists and is accessible
    const existingBranch = await getBranchById(branchId)
    if (!existingBranch) {
      throw new Error('Branch not found')
    }

    // Check code uniqueness (if being updated)
    if (code && code !== existingBranch.code) {
      const codeExists = await prisma.branch.findUnique({
        where: { code },
      })

      if (codeExists) {
        throw new Error('Branch code already exists')
      }
    }

    // Validate parent change
    if (parentId !== undefined) {
      if (parentId === branchId) {
        throw new Error('Branch cannot be its own parent')
      }

      if (parentId) {
        const accessibleBranchIds = await getAccessibleBranchIds()
        if (!accessibleBranchIds.includes(parentId)) {
          throw new Error('Parent branch not accessible')
        }

        const parentBranch = await prisma.branch.findUnique({
          where: { id: parentId },
        })

        if (!parentBranch) {
          throw new Error('Parent branch not found')
        }

        // Check if parentId would create a circular reference
        let checkParent = parentBranch
        while (checkParent.parentId) {
          if (checkParent.parentId === branchId) {
            throw new Error('Cannot create circular parent-child relationship')
          }
          const nextParent = await prisma.branch.findUnique({
            where: { id: checkParent.parentId },
          })
          if (!nextParent) break
          checkParent = nextParent
        }

        // Validate type hierarchy
        const branchType = type || existingBranch.type
        if (branchType === BranchType.HEADQUARTERS) {
          throw new Error('Headquarters cannot have a parent branch')
        }
        if (branchType === BranchType.BRANCH && parentBranch.type !== BranchType.HEADQUARTERS) {
          throw new Error('Branch must have Headquarters as parent')
        }
        if (branchType === BranchType.SUB_BRANCH && parentBranch.type !== BranchType.BRANCH) {
          throw new Error('Sub-branch must have Branch as parent')
        }
      } else if (parentId === null) {
        // Removing parent
        const branchType = type || existingBranch.type
        if (branchType !== BranchType.HEADQUARTERS) {
          throw new Error('Only Headquarters can exist without a parent')
        }
      }
    }

    // Validate HQ uniqueness when changing type to HEADQUARTERS
    if (type === BranchType.HEADQUARTERS && existingBranch.type !== BranchType.HEADQUARTERS) {
      const existingHQ = await prisma.branch.findFirst({
        where: withoutDeleted({
          type: BranchType.HEADQUARTERS,
        }),
      })

      if (existingHQ) {
        throw new Error('Only one headquarters is allowed. An active headquarters already exists.')
      }
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    const profileId = currentUser?.profile.id

    // Update branch
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(type && { type }),
        ...(parentId !== undefined && { parentId }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(isActive !== undefined && { isActive }),
        ...updateAuditData(profileId),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        profiles: {
          select: {
            id: true,
            fullName: true,
            status: true,
          },
        },
      },
    })

    return branch as BranchDetail
  } catch (error) {
    console.error('Error updating branch:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update branch')
  }
}

/**
 * Delete branch (soft delete)
 */
export async function deleteBranch(branchId: string): Promise<void> {
  try {
    // Check if branch exists and is accessible
    const existingBranch = await getBranchById(branchId)
    if (!existingBranch) {
      throw new Error('Branch not found')
    }

    // Check if branch has active children
    if (existingBranch.children.length > 0) {
      throw new Error(
        'Cannot delete branch with child branches. Delete or reassign children first.'
      )
    }

    // Check if branch has active users
    if (existingBranch.profiles.length > 0) {
      throw new Error('Cannot delete branch with users. Reassign users first.')
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile.id) {
      throw new Error('Unauthorized: No current user')
    }

    // Soft delete branch
    await softDelete(prisma.branch, branchId, currentUser.profile.id)
  } catch (error) {
    console.error('Error deleting branch:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete branch')
  }
}

/**
 * Get branch count by type
 */
export async function getBranchCountByType(type: BranchType): Promise<number> {
  try {
    const accessibleBranchIds = await getAccessibleBranchIds()

    const count = await prisma.branch.count({
      where: withoutDeleted({
        id: {
          in: accessibleBranchIds,
        },
        type,
      }),
    })

    return count
  } catch (error) {
    console.error('Error getting branch count:', error)
    return 0
  }
}

/**
 * Get child branches
 */
export async function getChildBranches(parentId: string): Promise<BranchListItem[]> {
  try {
    const accessibleBranchIds = await getAccessibleBranchIds()

    const branches = await prisma.branch.findMany({
      where: withoutDeleted({
        id: {
          in: accessibleBranchIds,
        },
        parentId,
      }),
      include: {
        _count: {
          select: {
            children: true,
            profiles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return branches as BranchListItem[]
  } catch (error) {
    console.error('Error getting child branches:', error)
    return []
  }
}
