import { NotificationType } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import {
  withoutDeleted,
  softDelete,
  createAuditData,
  updateAuditData,
} from '@/lib/utils/prisma-helpers'
import { getCurrentUser } from '@/features/auth/utils'
import type {
  NotificationListItem,
  NotificationDetail,
  CreateNotificationInput,
  NotificationFilters,
  PaginatedNotifications,
  NotificationStats,
  BulkNotificationInput,
} from '../types'

/**
 * Get paginated list of notifications for current user
 */
export async function getNotifications(
  filters: NotificationFilters = {}
): Promise<PaginatedNotifications> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const { type, isRead, page = 1, limit = 10 } = filters

    // Build where clause with soft delete filter
    const where: any = withoutDeleted({
      profileId: currentUser.profile.id,
      ...(type && { type }),
      ...(isRead !== undefined && { isRead }),
    })

    // Get total count
    const total = await prisma.notification.count({ where })

    // Get paginated data
    const notifications = await prisma.notification.findMany({
      where,
      include: {
        createdByProfile: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Transform to list items
    const data: NotificationListItem[] = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      metadata: notification.metadata as Record<string, any> | null,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      createdBy: notification.createdByProfile,
    }))

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Get notification by ID
 */
export async function getNotificationById(id: string): Promise<NotificationDetail | null> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const notification = await prisma.notification.findFirst({
      where: withoutDeleted({
        id,
        profileId: currentUser.profile.id, // Only allow access to own notifications
      }),
      include: {
        createdByProfile: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    if (!notification) {
      return null
    }

    return {
      id: notification.id,
      profileId: notification.profileId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      metadata: notification.metadata as Record<string, any> | null,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdBy: notification.createdByProfile,
    }
  } catch (error) {
    console.error('Error fetching notification:', error)
    throw error
  }
}

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      return 0
    }

    return await prisma.notification.count({
      where: withoutDeleted({
        profileId: currentUser.profile.id,
        isRead: false,
      }),
    })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

/**
 * Get notification statistics for current user
 */
export async function getNotificationStats(): Promise<NotificationStats> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const [unreadCount, totalCount, byTypeData] = await Promise.all([
      prisma.notification.count({
        where: withoutDeleted({
          profileId: currentUser.profile.id,
          isRead: false,
        }),
      }),
      prisma.notification.count({
        where: withoutDeleted({
          profileId: currentUser.profile.id,
        }),
      }),
      prisma.notification.groupBy({
        by: ['type'],
        where: withoutDeleted({
          profileId: currentUser.profile.id,
        }),
        _count: {
          type: true,
        },
      }),
    ])

    // Transform groupBy result to object
    const byType = byTypeData.reduce(
      (acc, item) => {
        acc[item.type] = item._count.type
        return acc
      },
      {} as Record<NotificationType, number>
    )

    return {
      unreadCount,
      totalCount,
      byType,
    }
  } catch (error) {
    console.error('Error fetching notification stats:', error)
    throw error
  }
}

/**
 * Create a notification
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<NotificationDetail> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const notification = await prisma.notification.create({
      data: {
        profileId: input.profileId,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
        metadata: input.metadata,
        ...createAuditData(currentUser.profile.id),
      },
      include: {
        createdByProfile: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    return {
      id: notification.id,
      profileId: notification.profileId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      metadata: notification.metadata as Record<string, any> | null,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdBy: notification.createdByProfile,
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Create bulk notifications for multiple users
 */
export async function createBulkNotifications(input: BulkNotificationInput): Promise<number> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const auditData = createAuditData(currentUser.profile.id)

    // Create notifications for each profile
    const notifications = input.profileIds.map(profileId => ({
      profileId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
      metadata: input.metadata,
      ...auditData,
    }))

    const result = await prisma.notification.createMany({
      data: notifications,
    })

    return result.count
  } catch (error) {
    console.error('Error creating bulk notifications:', error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<NotificationDetail> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    // Verify ownership before updating
    const existing = await prisma.notification.findFirst({
      where: withoutDeleted({
        id,
        profileId: currentUser.profile.id,
      }),
    })

    if (!existing) {
      throw new Error('Notification not found')
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        ...updateAuditData(currentUser.profile.id),
      },
      include: {
        createdByProfile: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    return {
      id: notification.id,
      profileId: notification.profileId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      metadata: notification.metadata as Record<string, any> | null,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdBy: notification.createdByProfile,
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllAsRead(): Promise<number> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const result = await prisma.notification.updateMany({
      where: withoutDeleted({
        profileId: currentUser.profile.id,
        isRead: false,
      }),
      data: {
        isRead: true,
        readAt: new Date(),
        ...updateAuditData(currentUser.profile.id),
      },
    })

    return result.count
  } catch (error) {
    console.error('Error marking all as read:', error)
    throw error
  }
}

/**
 * Delete notification (soft delete)
 */
export async function deleteNotification(id: string): Promise<void> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    // Verify ownership before deleting
    const existing = await prisma.notification.findFirst({
      where: withoutDeleted({
        id,
        profileId: currentUser.profile.id,
      }),
    })

    if (!existing) {
      throw new Error('Notification not found')
    }

    await softDelete(prisma.notification, id, currentUser.profile.id)
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

/**
 * Delete all read notifications for current user
 */
export async function deleteAllRead(): Promise<number> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.profile) {
      throw new Error('User not authenticated')
    }

    const result = await prisma.notification.updateMany({
      where: withoutDeleted({
        profileId: currentUser.profile.id,
        isRead: true,
      }),
      data: {
        deletedBy: currentUser.profile.id,
        deletedAt: new Date(),
      },
    })

    return result.count
  } catch (error) {
    console.error('Error deleting read notifications:', error)
    throw error
  }
}
