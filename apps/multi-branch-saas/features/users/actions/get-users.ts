'use server'

import { userFiltersSchema } from '@/lib/validation/user.schema'
import { getUsers } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import type { PaginatedUsers } from '../types'

export async function getUsersAction(filters: any): Promise<PaginatedUsers | null> {
  try {
    // Check permission
    const hasPermission = await checkPermission('users', 'read', PermissionScope.BRANCH)

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not have permission to view users')
    }

    // Validate filters
    const validation = userFiltersSchema.safeParse(filters)

    if (!validation.success) {
      console.error('Invalid filters:', validation.error)
      return null
    }

    // Get users
    const users = await getUsers(validation.data)

    return users
  } catch (error) {
    console.error('Error in getUsersAction:', error)
    return null
  }
}
