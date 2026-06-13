'use server'

import { markAsRead } from '../services/notification.service'
import type { ActionResult } from '@/features/auth/types'

/**
 * Mark notification as read
 */
export async function markAsReadAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Notification ID is required',
      }
    }

    await markAsRead(id)

    return {
      success: true,
      message: 'Notification marked as read',
    }
  } catch (error) {
    console.error('Error in markAsReadAction:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to mark notification as read',
    }
  }
}
