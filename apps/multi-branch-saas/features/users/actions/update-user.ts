'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateUserSchema } from '@/lib/validation/user.schema'
import { updateUser } from '../services'
import { checkPermission } from '@/lib/rbac'
import { PermissionScope } from '@/lib/generated/prisma'
import { logUpdate } from '@/features/audit/services'
import { prisma } from '@/lib/prisma'
import type { ActionResult } from '@/features/auth/types'

export async function updateUserAction(userId: string, data: any): Promise<ActionResult> {
  try {
    // Check permission
    const hasPermission = await checkPermission('users', 'update', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to update users',
      }
    }

    // Validate input
    const validation = updateUserSchema.safeParse(data)

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const { email, fullName, phone, branchId, roleIds, status, avatar } = validation.data

    // Get current user data before update
    const userBefore = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    })

    // Update user in database
    await updateUser(userId, {
      email,
      fullName,
      phone,
      branchId,
      roleIds,
      status,
      avatar,
    })

    // Log the update operation
    await logUpdate(
      'users',
      userId,
      {
        email: userBefore?.email,
        fullName: userBefore?.profile?.fullName,
        phone: userBefore?.profile?.phone,
        branchId: userBefore?.profile?.branchId,
        roleIds: userBefore?.profile?.userRoles.map(ur => ur.roleId),
        status: userBefore?.profile?.status,
        avatar: userBefore?.profile?.avatar,
      },
      {
        email,
        fullName,
        phone,
        branchId,
        roleIds,
        status,
        avatar,
      }
    )

    // Update email in Supabase Auth if changed
    if (email) {
      const supabase = createAdminClient()

      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email,
      })

      if (authError) {
        console.error('Error updating email in Supabase Auth:', authError)
        // Don't fail the whole operation if auth update fails
      }
    }

    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    console.error('Error in updateUserAction:', error)

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
