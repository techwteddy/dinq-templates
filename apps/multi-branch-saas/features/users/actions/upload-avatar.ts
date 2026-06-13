'use server'

import { revalidatePath } from 'next/cache'
import { uploadAvatar, deleteAvatar } from '@/lib/supabase/storage'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { logUpdate } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'

export async function uploadAvatarAction(
  userId: string,
  formData: FormData
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    // Get current user
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
      }
    }

    // Check if user can only upload their own avatar (or is admin)
    const isAdmin = currentUser.profile.userRoles.some(
      ur => ur.role.level <= 2 // Super Admin or Regional Manager
    )

    if (!isAdmin && currentUser.id !== userId) {
      return {
        success: false,
        error: 'Unauthorized: You can only upload your own avatar',
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

    // Get user's current avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    })

    if (!user || !user.profile) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const oldAvatar = user.profile.avatar

    // Upload new avatar
    const result = await uploadAvatar(userId, file)

    if (!result.success || !result.url) {
      return {
        success: false,
        error: result.error || 'Failed to upload avatar',
      }
    }

    // Update user profile with new avatar URL
    await prisma.profile.update({
      where: { userId },
      data: {
        avatar: result.url,
      },
    })

    // Delete old avatar if it exists
    if (oldAvatar) {
      // Extract path from URL
      const oldPath = oldAvatar.split('/storage/v1/object/public/avatars/')[1]
      if (oldPath) {
        await deleteAvatar(userId, oldPath)
      }
    }

    // Log the update
    await logUpdate('users', userId, { avatar: oldAvatar }, { avatar: result.url })

    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatarUrl: result.url },
    }
  } catch (error) {
    console.error('Error in uploadAvatarAction:', error)

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
