'use server'

import { getBranchesHierarchy } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import type { BranchHierarchyItem } from '../types'

export async function getBranchHierarchyAction(): Promise<BranchHierarchyItem[]> {
  try {
    // Check permission
    const hasPermission = await checkPermission('branches', 'read', PermissionScope.BRANCH)

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not have permission to view branches')
    }

    // Get branch hierarchy
    const hierarchy = await getBranchesHierarchy()

    return hierarchy
  } catch (error) {
    console.error('Error in getBranchHierarchyAction:', error)
    return []
  }
}
