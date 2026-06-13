import type { NotificationType } from '@/lib/generated/prisma'

/**
 * Notification list item for table display
 */
export interface NotificationListItem {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  metadata: Record<string, any> | null
  isRead: boolean
  readAt: Date | null
  createdAt: Date
  createdBy: {
    id: string
    fullName: string
    avatar: string | null
  } | null
}

/**
 * Notification detail
 */
export interface NotificationDetail {
  id: string
  profileId: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  metadata: Record<string, any> | null
  isRead: boolean
  readAt: Date | null
  createdAt: Date
  updatedAt: Date
  createdBy: {
    id: string
    fullName: string
    avatar: string | null
  } | null
}

/**
 * Create notification input
 */
export interface CreateNotificationInput {
  profileId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
}

/**
 * Notification filters for listing
 */
export interface NotificationFilters {
  type?: NotificationType
  isRead?: boolean
  page?: number
  limit?: number
}

/**
 * Paginated notifications response
 */
export interface PaginatedNotifications {
  data: NotificationListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  unreadCount: number
  totalCount: number
  byType: Record<NotificationType, number>
}

/**
 * Bulk notification input
 */
export interface BulkNotificationInput {
  profileIds: string[]
  type: NotificationType
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
}
