'use server'

import { getNotificationStats } from '../services/notification.service'
import type { NotificationStats } from '../types'

/**
 * Get notification statistics
 */
export async function getNotificationStatsAction(): Promise<NotificationStats | null> {
  try {
    const stats = await getNotificationStats()
    return stats
  } catch (error) {
    console.error('Error in getNotificationStatsAction:', error)
    return null
  }
}
