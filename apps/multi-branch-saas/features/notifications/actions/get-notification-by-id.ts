'use server'

import { getNotificationById } from '../services/notification.service'
import type { NotificationDetail } from '../types'

/**
 * Get notification by ID
 */
export async function getNotificationByIdAction(id: string): Promise<NotificationDetail | null> {
  try {
    if (!id) {
      return null
    }

    const notification = await getNotificationById(id)

    return notification
  } catch (error) {
    console.error('Error in getNotificationByIdAction:', error)
    return null
  }
}
