'use server'

import { getUserByIdSchema } from '@/lib/validation/user.schema'
import { getUserById } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import type { UserDetail } from '../types'

export async function getUserByIdAction(userId: string): Promise<UserDetail | null> {
  try {
    // Check permission
    const hasPermission = await checkPermission('users', 'read', PermissionScope.BRANCH)

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not have permission to view user details')
    }

    // Validate input
    const validation = getUserByIdSchema.safeParse({ userId })

    if (!validation.success) {
      console.error('Invalid user ID:', validation.error)
      return null
    }

    // Get user
    const user = await getUserById(userId)

    return user
  } catch (error) {
    console.error('Error in getUserByIdAction:', error)
    return null
  }
}
