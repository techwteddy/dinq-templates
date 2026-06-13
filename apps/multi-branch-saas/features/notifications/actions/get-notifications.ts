'use server'

import { notificationFiltersSchema } from '@/lib/validation/notification.schema'
import { getNotifications } from '../services/notification.service'
import type { PaginatedNotifications } from '../types'

/**
 * Get notifications for current user
 */
export async function getNotificationsAction(filters: any): Promise<PaginatedNotifications | null> {
  try {
    // Validate filters
    const validation = notificationFiltersSchema.safeParse(filters)

    if (!validation.success) {
      console.error('Invalid filters:', validation.error)
      return null
    }

    // Get notifications
    const notifications = await getNotifications(validation.data)

    return notifications
  } catch (error) {
    console.error('Error in getNotificationsAction:', error)
    return null
  }
}
