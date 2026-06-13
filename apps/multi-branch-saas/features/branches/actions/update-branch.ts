'use server'

import { revalidatePath } from 'next/cache'
import { updateBranchSchema } from '@/lib/validation/branch.schema'
import { updateBranch } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import { logUpdate } from '@/features/audit/services'
import { validateBranchDepth } from '@/lib/utils/branch-depth'
import { prisma } from '@/lib/prisma'
import type { ActionResult } from '@/features/auth/types'

export async function updateBranchAction(branchId: string, data: any): Promise<ActionResult> {
  try {
    // Check permission
    const hasPermission = await checkPermission('branches', 'update', PermissionScope.ALL)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to update branches',
      }
    }

    // Validate input
    const validation = updateBranchSchema.safeParse(data)

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const { name, code, type, parentId, address, phone, email, isActive } = validation.data

    // Get current branch data before update
    const branchBefore = await prisma.branch.findUnique({
      where: { id: branchId },
    })

    // Validate branch depth if parent is changing
    if (parentId !== undefined && parentId !== branchBefore?.parentId) {
      const depthValidation = await validateBranchDepth(parentId || null)

      if (!depthValidation.valid) {
        return {
          success: false,
          error: depthValidation.message || 'Maximum branch depth exceeded',
        }
      }
    }

    // Update branch
    await updateBranch(branchId, {
      name,
      code,
      type,
      parentId,
      address,
      phone,
      email,
      isActive,
    })

    // Log the update operation
    await logUpdate(
      'branches',
      branchId,
      {
        name: branchBefore?.name,
        code: branchBefore?.code,
        type: branchBefore?.type,
        parentId: branchBefore?.parentId,
        address: branchBefore?.address,
        phone: branchBefore?.phone,
        email: branchBefore?.email,
        isActive: branchBefore?.isActive,
      },
      {
        name,
        code,
        type,
        parentId,
        address,
        phone,
        email,
        isActive,
      }
    )

    revalidatePath('/branches')
    revalidatePath(`/branches/${branchId}`)

    return {
      success: true,
      message: 'Branch updated successfully',
    }
  } catch (error) {
    console.error('Error in updateBranchAction:', error)

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
