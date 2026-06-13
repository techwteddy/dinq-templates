'use server'

import { getDashboardStats, getRecentActivity } from '../services/dashboard.service'
import type { DashboardStats, RecentActivity } from '../types'

/**
 * Server action to get dashboard statistics
 */
export async function getDashboardStatsAction(): Promise<DashboardStats> {
  return await getDashboardStats()
}

/**
 * Server action to get recent activity
 */
export async function getRecentActivityAction(limit?: number): Promise<RecentActivity[]> {
  return await getRecentActivity(limit)
}
