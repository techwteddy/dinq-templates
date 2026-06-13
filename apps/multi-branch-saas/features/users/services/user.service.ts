import { UserStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getAccessibleBranchIds } from '@/lib/rbac'
import {
  withoutDeleted,
  softDelete,
  createAuditData,
  updateAuditData,
} from '@/lib/utils/prisma-helpers'
import { getCurrentUser } from '@/features/auth/utils'
import { sendWelcomeEmail, sendRoleChangedEmail, sendAccountStatusChangedEmail } from '@/lib/email'
import type {
  UserListItem,
  UserDetail,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginatedUsers,
} from '../types'

/**
 * Get paginated list of users with filters
 */
export async function getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
  try {
    const { search, branchId, status, roleType, page = 1, limit = 10 } = filters

    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    // Build where clause with soft delete filter
    const where: any = withoutDeleted({
      profile: {
        branchId: {
          in: branchId ? [branchId] : accessibleBranchIds,
        },
        ...(status && { status }),
        ...(roleType && {
          userRoles: {
            some: {
              role: {
                type: roleType,
              },
            },
          },
        }),
      },
    })

    // Add search filter
    if (search) {
      where.OR = [
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          profile: {
            fullName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ]
    }

    // Get total count
    const total = await prisma.user.count({ where })

    // Get paginated data
    const users = await prisma.user.findMany({
      where,
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      data: users as UserListItem[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error getting users:', error)
    throw new Error('Failed to fetch users')
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<UserDetail | null> {
  try {
    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    const user = await prisma.user.findFirst({
      where: withoutDeleted({
        id: userId,
        profile: {
          branchId: {
            in: accessibleBranchIds,
          },
        },
      }),
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                address: true,
                phone: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return user as UserDetail | null
  } catch (error) {
    console.error('Error getting user:', error)
    throw new Error('Failed to fetch user')
  }
}

/**
 * Create new user
 */
export async function createUser(
  data: CreateUserInput,
  supabaseUserId?: string
): Promise<UserDetail> {
  try {
    const { email, password, fullName, phone, branchId, roleIds, status } = data

    // Check if branch exists and is accessible
    const accessibleBranchIds = await getAccessibleBranchIds()
    if (!accessibleBranchIds.includes(branchId)) {
      throw new Error('Branch not accessible')
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('Email already exists')
    }

    // Validate roles exist
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    })

    if (roles.length !== roleIds.length) {
      throw new Error('Invalid role IDs')
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    const profileId = currentUser?.profile.id

    // Create user with profile and roles
    const user = await prisma.user.create({
      data: {
        id: supabaseUserId,
        email,
        ...createAuditData(profileId),
        profile: {
          create: {
            fullName,
            phone: phone || null,
            branchId,
            status: status || UserStatus.ACTIVE,
            ...createAuditData(profileId),
            userRoles: {
              create: roleIds.map(roleId => ({
                roleId,
                ...createAuditData(profileId),
              })),
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                address: true,
                phone: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Send welcome email (non-blocking - don't fail user creation if email fails)
    if (user.profile) {
      sendWelcomeEmail({
        to: user.email,
        userName: user.profile.fullName,
        userEmail: user.email,
      }).catch(error => {
        console.error('Failed to send welcome email:', error)
        // Log but don't throw - email failure shouldn't block user creation
      })
    }

    return user as UserDetail
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create user')
  }
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: UpdateUserInput): Promise<UserDetail> {
  try {
    const { email, fullName, phone, branchId, roleIds, status, avatar } = data

    // Check if user exists and is accessible
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Check if branch is accessible (if being updated)
    if (branchId) {
      const accessibleBranchIds = await getAccessibleBranchIds()
      if (!accessibleBranchIds.includes(branchId)) {
        throw new Error('Branch not accessible')
      }
    }

    // Check email uniqueness (if being updated)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        throw new Error('Email already exists')
      }
    }

    // Validate roles (if being updated)
    if (roleIds) {
      const roles = await prisma.role.findMany({
        where: {
          id: {
            in: roleIds,
          },
        },
      })

      if (roles.length !== roleIds.length) {
        throw new Error('Invalid role IDs')
      }
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    const profileId = currentUser?.profile.id

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...updateAuditData(profileId),
        profile: {
          update: {
            ...(fullName && { fullName }),
            ...(phone !== undefined && { phone }),
            ...(branchId && { branchId }),
            ...(status && { status }),
            ...(avatar !== undefined && { avatar }),
            ...updateAuditData(profileId),
          },
        },
      },
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                address: true,
                phone: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Update roles if provided
    if (roleIds && existingUser.profile) {
      // Soft delete existing roles (set deletedAt instead of hard delete)
      await prisma.userRole.updateMany({
        where: {
          profileId: existingUser.profile.id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: profileId,
        },
      })

      // Create new roles with audit trail
      for (const roleId of roleIds) {
        await prisma.userRole.create({
          data: {
            profileId: existingUser.profile.id,
            roleId,
            ...createAuditData(profileId),
          },
        })
      }
    }

    // Fetch updated user with roles
    const updatedUser = await getUserById(userId)
    if (!updatedUser) {
      throw new Error('Failed to fetch updated user')
    }

    // Send email notifications (non-blocking)
    if (updatedUser.profile) {
      // Send role changed email if roles were updated
      if (roleIds && existingUser.profile) {
        const oldRoles = existingUser.profile.userRoles.map(ur => ur.role.name)
        const newRoles = updatedUser.profile.userRoles.map(ur => ur.role.name)

        // Only send if roles actually changed
        if (JSON.stringify(oldRoles.sort()) !== JSON.stringify(newRoles.sort())) {
          sendRoleChangedEmail({
            to: updatedUser.email,
            userName: updatedUser.profile.fullName,
            oldRoles,
            newRoles,
            changedBy: currentUser?.profile.fullName || 'Administrator',
          }).catch(error => {
            console.error('Failed to send role changed email:', error)
          })
        }
      }

      // Send status changed email if status was updated
      if (status && existingUser.profile && status !== existingUser.profile.status) {
        sendAccountStatusChangedEmail({
          to: updatedUser.email,
          userName: updatedUser.profile.fullName,
          newStatus: status,
          changedBy: currentUser?.profile.fullName || 'Administrator',
        }).catch(error => {
          console.error('Failed to send account status changed email:', error)
        })
      }
    }

    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update user')
  }
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // Check if user exists and is accessible
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Get current user for audit trail
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile.id) {
      throw new Error('Unauthorized: No current user')
    }

    // Soft delete user
    await softDelete(prisma.user, userId, currentUser.profile.id)
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete user')
  }
}

/**
 * Get users count by branch
 */
export async function getUsersCountByBranch(branchId: string): Promise<number> {
  try {
    const count = await prisma.user.count({
      where: withoutDeleted({
        profile: {
          branchId,
        },
      }),
    })

    return count
  } catch (error) {
    console.error('Error getting users count:', error)
    return 0
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(roleId: string): Promise<UserListItem[]> {
  try {
    const accessibleBranchIds = await getAccessibleBranchIds()

    const users = await prisma.user.findMany({
      where: withoutDeleted({
        profile: {
          branchId: {
            in: accessibleBranchIds,
          },
          userRoles: {
            some: {
              roleId,
            },
          },
        },
      }),
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users as UserListItem[]
  } catch (error) {
    console.error('Error getting users by role:', error)
    return []
  }
}
