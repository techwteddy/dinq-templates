'use server'

import { revalidatePath } from 'next/cache'
import { deleteBranchSchema } from '@/lib/validation/branch.schema'
import { deleteBranch, getBranchById } from '../services'
import { checkPermission, canAccessBranch } from '@/lib/rbac'
import { PermissionScope, RoleType } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { logDelete } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'

export async function deleteBranchAction(branchId: string): Promise<ActionResult> {
  try {
    // Get current user
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
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
          'Unauthorized: Only Super Admin, Regional Manager, and Branch Manager can delete branches',
      }
    }

    // Check permission
    const hasPermission = await checkPermission('branches', 'delete', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to delete branches',
      }
    }

    // Validate input
    const validation = deleteBranchSchema.safeParse({ branchId })

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid branch ID',
      }
    }

    // Check if branch is accessible
    const hasAccess = await canAccessBranch(branchId)

    if (!hasAccess) {
      return {
        success: false,
        error: 'Unauthorized: You can only delete branches within your hierarchy',
      }
    }

    // Get the branch to check if it's the user's own branch
    const branch = await getBranchById(branchId)

    if (!branch) {
      return {
        success: false,
        error: 'Branch not found',
      }
    }

    // Prevent users from deleting their own branch
    if (currentUser.profile.branchId === branchId) {
      return {
        success: false,
        error: 'You cannot delete your own branch',
      }
    }

    // Log the delete operation before deleting
    await logDelete('branches', branchId, {
      name: branch.name,
      code: branch.code,
      type: branch.type,
      parentId: branch.parentId,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      isActive: branch.isActive,
    })

    // Delete branch (deleteBranch service already checks for children and users)
    await deleteBranch(branchId)

    revalidatePath('/branches')

    return {
      success: true,
      message: 'Branch deleted successfully',
    }
  } catch (error) {
    console.error('Error in deleteBranchAction:', error)

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
