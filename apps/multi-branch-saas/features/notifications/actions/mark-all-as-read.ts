'use server'

import { markAllAsRead } from '../services/notification.service'
import type { ActionResult } from '@/features/auth/types'

/**
 * Mark all notifications as read
 */
export async function markAllAsReadAction(): Promise<ActionResult> {
  try {
    const count = await markAllAsRead()

    return {
      success: true,
      message: `${count} notification${count !== 1 ? 's' : ''} marked as read`,
    }
  } catch (error) {
    console.error('Error in markAllAsReadAction:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to mark notifications as read',
    }
  }
}
