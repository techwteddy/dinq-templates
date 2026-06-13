import { z } from 'zod'
import { NotificationType } from '@/lib/generated/prisma'

// Create notification schema
export const createNotificationSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  message: z.string().min(1, 'Message is required'),
  link: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>

// Bulk create notification schema
export const bulkCreateNotificationSchema = z.object({
  profileIds: z.array(z.string()).min(1, 'At least one profile ID is required'),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  message: z.string().min(1, 'Message is required'),
  link: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export type BulkCreateNotificationInput = z.infer<typeof bulkCreateNotificationSchema>

// Notification filters schema
export const notificationFiltersSchema = z.object({
  type: z.nativeEnum(NotificationType).optional(),
  isRead: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

export type NotificationFiltersInput = z.infer<typeof notificationFiltersSchema>
