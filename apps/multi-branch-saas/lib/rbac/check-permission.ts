import { PermissionScope, RoleType, BranchType } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import type { PermissionCheck } from './types'

/**
 * Check if current user has a specific permission
 * @param resource - Resource name (e.g., 'users', 'branches')
 * @param action - Action name (e.g., 'create', 'read', 'update', 'delete')
 * @param scope - Permission scope (e.g., 'OWN', 'BRANCH', 'REGION', 'ALL')
 */
export async function checkPermission(
  resource: string,
  action: string,
  scope: PermissionScope
): Promise<boolean> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return false
    }

    // Super Admin has all permissions
    const isSuperAdmin = user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)

    if (isSuperAdmin) {
      return true
    }

    // Check if user has the specific permission
    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: {
          in: user.profile.userRoles.map(ur => ur.role.id),
        },
        permission: {
          resource,
          action,
          scope,
        },
      },
    })

    return !!hasPermission
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Check if current user has any of the specified permissions
 */
export async function checkAnyPermission(permissions: PermissionCheck[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return false
    }

    // Super Admin has all permissions
    const isSuperAdmin = user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)

    if (isSuperAdmin) {
      return true
    }

    // Check if user has any of the permissions
    for (const perm of permissions) {
      const hasPermission = await checkPermission(perm.resource, perm.action, perm.scope)

      if (hasPermission) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

/**
 * Check if current user has all of the specified permissions
 */
export async function checkAllPermissions(permissions: PermissionCheck[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return false
    }

    // Super Admin has all permissions
    const isSuperAdmin = user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)

    if (isSuperAdmin) {
      return true
    }

    // Check if user has all permissions
    for (const perm of permissions) {
      const hasPermission = await checkPermission(perm.resource, perm.action, perm.scope)

      if (!hasPermission) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

/**
 * Get all permissions for current user
 */
export async function getCurrentUserPermissions(): Promise<PermissionCheck[]> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    const roleIds = user.profile.userRoles.map(ur => ur.role.id)

    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
      include: {
        permission: true,
      },
    })

    return rolePermissions.map(rp => ({
      resource: rp.permission.resource,
      action: rp.permission.action,
      scope: rp.permission.scope,
    }))
  } catch (error) {
    console.error('Error getting user permissions:', error)
    return []
  }
}

/**
 * Check if user can access a specific branch
 */
export async function canAccessBranch(branchId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return false
    }

    // Super Admin can access all branches
    const isSuperAdmin = user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)

    if (isSuperAdmin) {
      return true
    }

    // User's own branch
    if (user.profile.branchId === branchId) {
      return true
    }

    // Check if branch is in user's hierarchy
    const userBranch = await prisma.branch.findUnique({
      where: { id: user.profile.branchId },
    })

    if (!userBranch) {
      return false
    }

    // HQ can access all branches
    if (userBranch.type === BranchType.HEADQUARTERS) {
      return true
    }

    // Check if requested branch is a child of user's branch
    const requestedBranch = await prisma.branch.findUnique({
      where: { id: branchId },
    })

    if (!requestedBranch) {
      return false
    }

    // Check if user's branch is an ancestor of requested branch
    let currentBranch = requestedBranch
    while (currentBranch.parentId) {
      if (currentBranch.parentId === user.profile.branchId) {
        return true
      }

      const parentBranch = await prisma.branch.findUnique({
        where: { id: currentBranch.parentId },
      })

      if (!parentBranch) break
      currentBranch = parentBranch
    }

    return false
  } catch (error) {
    console.error('Error checking branch access:', error)
    return false
  }
}

/**
 * Get all branch IDs that user can access
 */
export async function getAccessibleBranchIds(): Promise<string[]> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    const userBranch = await prisma.branch.findUnique({
      where: { id: user.profile.branchId },
    })

    if (!userBranch) {
      return []
    }

    // Super Admin or HQ can access all branches
    const isSuperAdmin = user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)

    if (isSuperAdmin || userBranch.type === BranchType.HEADQUARTERS) {
      const allBranches = await prisma.branch.findMany({
        select: { id: true },
      })
      return allBranches.map(b => b.id)
    }

    // Get user's branch and all child branches
    const accessibleBranchIds: string[] = [user.profile.branchId]

    // Recursive function to get all child branches
    async function getChildBranches(parentId: string): Promise<void> {
      const children = await prisma.branch.findMany({
        where: { parentId },
        select: { id: true },
      })

      for (const child of children) {
        accessibleBranchIds.push(child.id)
        await getChildBranches(child.id)
      }
    }

    await getChildBranches(user.profile.branchId)

    return accessibleBranchIds
  } catch (error) {
    console.error('Error getting accessible branches:', error)
    return []
  }
}
