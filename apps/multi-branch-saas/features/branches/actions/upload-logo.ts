'use server'

import { revalidatePath } from 'next/cache'
import { uploadLogo, deleteLogo } from '@/lib/supabase/storage'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import { logUpdate } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'

export async function uploadLogoAction(
  branchId: string,
  formData: FormData
): Promise<ActionResult<{ logoUrl: string }>> {
  try {
    // Check permission
    const hasPermission = await checkPermission('branches', 'update', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to upload branch logos',
      }
    }

    // Get file from form data
    const file = formData.get('file') as File

    if (!file) {
      return {
        success: false,
        error: 'No file provided',
      }
    }

    // Get branch's current logo
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    })

    if (!branch) {
      return {
        success: false,
        error: 'Branch not found',
      }
    }

    const oldLogo = branch.logo

    // Upload new logo
    const result = await uploadLogo(branchId, file)

    if (!result.success || !result.url) {
      return {
        success: false,
        error: result.error || 'Failed to upload logo',
      }
    }

    // Update branch with new logo URL
    await prisma.branch.update({
      where: { id: branchId },
      data: {
        logo: result.url,
      },
    })

    // Delete old logo if it exists
    if (oldLogo) {
      const oldPath = oldLogo.split('/storage/v1/object/public/logos/')[1]
      if (oldPath) {
        await deleteLogo(branchId, oldPath)
      }
    }

    // Log the update
    await logUpdate('branches', branchId, { logo: oldLogo }, { logo: result.url })

    revalidatePath('/branches')
    revalidatePath(`/branches/${branchId}`)

    return {
      success: true,
      message: 'Logo uploaded successfully',
      data: { logoUrl: result.url },
    }
  } catch (error) {
    console.error('Error in uploadLogoAction:', error)

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
