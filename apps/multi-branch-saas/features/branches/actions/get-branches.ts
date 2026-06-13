'use server'

import { prisma } from '@/lib/prisma'
import { branchFiltersSchema } from '@/lib/validation/branch.schema'
import { getBranches } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import type { BranchListItem } from '../types'

export async function getBranchesAction(filters: any): Promise<BranchListItem[]> {
  try {
    // Check permission
    const hasPermission = await checkPermission('branches', 'read', PermissionScope.BRANCH)

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not have permission to view branches')
    }

    // Validate filters
    const validation = branchFiltersSchema.safeParse(filters)

    if (!validation.success) {
      console.error('Invalid filters:', validation.error)
      return []
    }

    // Get branches
    const branches = await getBranches(validation.data)

    return branches
  } catch (error) {
    console.error('Error in getBranchesAction:', error)
    return []
  }
}

// Keep the original function for backward compatibility
export async function getActiveBranches() {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
      },
      orderBy: [
        { type: 'asc' }, // HQ first
        { name: 'asc' },
      ],
    })

    return branches
  } catch (error) {
    console.error('Error fetching branches:', error)
    return []
  }
}
