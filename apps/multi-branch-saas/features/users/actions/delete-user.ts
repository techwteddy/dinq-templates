'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteUserSchema } from '@/lib/validation/user.schema'
import { deleteUser, getUserById } from '../services'
import { checkPermission } from '@/lib/rbac'
import { getCurrentUser } from '@/features/auth/utils'
import { PermissionScope, RoleType } from '@/lib/generated/prisma'
import { logDelete } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    // Get current user
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
      }
    }

    // Prevent self-deletion
    if (currentUser.id === userId) {
      return {
        success: false,
        error: 'You cannot delete your own account',
      }
    }

    // Check if user has one of the allowed roles
    const allowedRoles = [RoleType.SUPER_ADMIN, RoleType.REGIONAL_MANAGER, RoleType.BRANCH_MANAGER]
    const hasAllowedRole = currentUser.profile.userRoles.some(ur =>
      (allowedRoles as string[]).includes(ur.role.type)
    )

    if (!hasAllowedRole) {
      return {
        success: false,
        error:
          'Unauthorized: Only Super Admin, Regional Manager, and Branch Manager can delete users',
      }
    }

    // Check permission
    const hasPermission = await checkPermission('users', 'delete', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to delete users',
      }
    }

    // Validate input
    const validation = deleteUserSchema.safeParse({ userId })

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid user ID',
      }
    }

    // Get the target user to check their role level
    const targetUser = await getUserById(userId)

    if (!targetUser) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    // Check role hierarchy: cannot delete users with equal or higher role level
    // Get current user's highest role (lowest level number)
    const currentUserHighestRole = currentUser.profile.userRoles.reduce((prev, current) => {
      return prev.role.level < current.role.level ? prev : current
    })

    // Get target user's highest role (lowest level number)
    if (targetUser.profile && targetUser.profile.userRoles.length > 0) {
      const targetUserHighestRole = targetUser.profile.userRoles.reduce((prev, current) => {
        return prev.role.level < current.role.level ? prev : current
      })

      // If target user has equal or higher role (lower or equal level number), prevent deletion
      if (targetUserHighestRole.role.level <= currentUserHighestRole.role.level) {
        return {
          success: false,
          error: `You cannot delete users with equal or higher role level. Target user's highest role: ${targetUserHighestRole.role.name} (Level ${targetUserHighestRole.role.level})`,
        }
      }
    }

    // Log the delete operation before deleting
    await logDelete('users', userId, {
      email: targetUser.email,
      fullName: targetUser.profile?.fullName,
      phone: targetUser.profile?.phone,
      branchId: targetUser.profile?.branchId,
      roleIds: targetUser.profile?.userRoles.map(ur => ur.role.id),
      status: targetUser.profile?.status,
    })

    // Delete user from database
    await deleteUser(userId)

    // Delete user from Supabase Auth using admin client
    const supabase = createAdminClient()

    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting user from Supabase Auth:', authError)
      // Don't fail the whole operation if auth deletion fails
    }

    revalidatePath('/users')

    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    console.error('Error in deleteUserAction:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
