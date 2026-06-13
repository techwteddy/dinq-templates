'use server'

import { deleteAllRead } from '../services/notification.service'
import type { ActionResult } from '@/features/auth/types'

/**
 * Delete all read notifications
 */
export async function deleteAllReadAction(): Promise<ActionResult> {
  try {
    const count = await deleteAllRead()

    return {
      success: true,
      message: `${count} notification${count !== 1 ? 's' : ''} deleted`,
    }
  } catch (error) {
    console.error('Error in deleteAllReadAction:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete notifications',
    }
  }
}
