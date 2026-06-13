'use server'

import { revalidatePath } from 'next/cache'
import { createBranchSchema } from '@/lib/validation/branch.schema'
import { createBranch } from '../services'
import { checkPermission, canAccessBranch } from '@/lib/rbac'
import { PermissionScope, RoleType } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { logCreate } from '@/features/audit/services'
import { validateBranchDepth } from '@/lib/utils/branch-depth'
import type { ActionResult } from '@/features/auth/types'

export async function createBranchAction(data: any): Promise<ActionResult> {
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
          'Unauthorized: Only Super Admin, Regional Manager, and Branch Manager can create branches',
      }
    }

    // Check permission
    const hasPermission = await checkPermission('branches', 'create', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to create branches',
      }
    }

    // Validate input
    const validation = createBranchSchema.safeParse(data)

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const { name, code, type, parentId, address, phone, email, isActive } = validation.data

    // Check if parent branch is accessible (if parentId is provided)
    if (parentId) {
      const hasAccessToParent = await canAccessBranch(parentId)

      if (!hasAccessToParent) {
        return {
          success: false,
          error: 'Unauthorized: You can only create branches under branches within your hierarchy',
        }
      }
    }

    // Validate branch depth
    const depthValidation = await validateBranchDepth(parentId || null)

    if (!depthValidation.valid) {
      return {
        success: false,
        error: depthValidation.message || 'Maximum branch depth exceeded',
      }
    }

    // Create branch
    const createdBranch = await createBranch({
      name,
      code,
      type,
      parentId,
      address,
      phone,
      email,
      isActive,
    })

    // Log the create operation
    await logCreate('branches', createdBranch.id, {
      name,
      code,
      type,
      parentId,
      address,
      phone,
      email,
      isActive,
    })

    revalidatePath('/branches')

    return {
      success: true,
      message: 'Branch created successfully',
    }
  } catch (error) {
    console.error('Error in createBranchAction:', error)

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
