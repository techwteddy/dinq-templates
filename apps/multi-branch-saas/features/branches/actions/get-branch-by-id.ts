'use server'

import { getBranchByIdSchema } from '@/lib/validation/branch.schema'
import { getBranchById } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import type { BranchDetail } from '../types'

export async function getBranchByIdAction(branchId: string): Promise<BranchDetail | null> {
  try {
    // Check permission
    const hasPermission = await checkPermission('branches', 'read', PermissionScope.BRANCH)

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not have permission to view branch details')
    }

    // Validate input
    const validation = getBranchByIdSchema.safeParse({ branchId })

    if (!validation.success) {
      console.error('Invalid branch ID:', validation.error)
      return null
    }

    // Get branch
    const branch = await getBranchById(branchId)

    return branch
  } catch (error) {
    console.error('Error in getBranchByIdAction:', error)
    return null
  }
}
