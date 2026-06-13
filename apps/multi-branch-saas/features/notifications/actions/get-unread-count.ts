'use server'

import { getUnreadCount } from '../services/notification.service'

/**
 * Get unread notification count
 */
export async function getUnreadCountAction(): Promise<number> {
  try {
    const count = await getUnreadCount()
    return count
  } catch (error) {
    console.error('Error in getUnreadCountAction:', error)
    return 0
  }
}
