'use server'

import { deleteNotification } from '../services/notification.service'
import type { ActionResult } from '@/features/auth/types'

/**
 * Delete notification
 */
export async function deleteNotificationAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Notification ID is required',
      }
    }

    await deleteNotification(id)

    return {
      success: true,
      message: 'Notification deleted',
    }
  } catch (error) {
    console.error('Error in deleteNotificationAction:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete notification',
    }
  }
}
