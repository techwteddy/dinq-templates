'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'
import type { NotificationListItem } from '../types'
import { NotificationType } from '@/lib/generated/prisma'

interface NotificationItemProps {
  notification: NotificationListItem
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  isSelected?: boolean
}

// Notification type colors
const typeColors: Record<NotificationType, string> = {
  [NotificationType.USER_CREATED]: 'bg-green-500/10 text-green-700 dark:text-green-400',
  [NotificationType.USER_UPDATED]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  [NotificationType.USER_DELETED]: 'bg-red-500/10 text-red-700 dark:text-red-400',
  [NotificationType.BRANCH_CREATED]: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  [NotificationType.BRANCH_UPDATED]: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  [NotificationType.BRANCH_DELETED]: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  [NotificationType.ROLE_ASSIGNED]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  [NotificationType.ROLE_REMOVED]: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  [NotificationType.PERMISSION_CHANGED]: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  [NotificationType.CUSTOM]: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
}

// Notification type labels
const typeLabels: Record<NotificationType, string> = {
  [NotificationType.USER_CREATED]: 'User Created',
  [NotificationType.USER_UPDATED]: 'User Updated',
  [NotificationType.USER_DELETED]: 'User Deleted',
  [NotificationType.BRANCH_CREATED]: 'Branch Created',
  [NotificationType.BRANCH_UPDATED]: 'Branch Updated',
  [NotificationType.BRANCH_DELETED]: 'Branch Deleted',
  [NotificationType.ROLE_ASSIGNED]: 'Role Assigned',
  [NotificationType.ROLE_REMOVED]: 'Role Removed',
  [NotificationType.PERMISSION_CHANGED]: 'Permission Changed',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'Announcement',
  [NotificationType.CUSTOM]: 'Notification',
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  isSelected = false,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const content = (
    <div
      className={cn(
        'hover:bg-muted/50 relative flex cursor-pointer gap-3 rounded-lg border p-4 transition-all',
        !notification.isRead && 'bg-muted/30 border-primary/20',
        isSelected && 'ring-primary ring-2 ring-offset-2'
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="bg-primary absolute top-1/2 left-2 h-2 w-2 -translate-y-1/2 rounded-full" />
      )}

      <div className="flex-1 space-y-1 pl-2">
        {/* Type badge */}
        <Badge variant="secondary" className={cn('text-xs', typeColors[notification.type])}>
          {typeLabels[notification.type]}
        </Badge>

        {/* Title */}
        <h4 className="text-sm leading-none font-medium">{notification.title}</h4>

        {/* Message */}
        <p className="text-muted-foreground text-sm">{notification.message}</p>

        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
          {notification.createdBy && (
            <>
              <span>•</span>
              <span>by {notification.createdBy.fullName}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1">
        {notification.link && (
          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
            <Link href={notification.link} onClick={e => e.stopPropagation()}>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={e => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )

  return notification.link ? <div>{content}</div> : content
}
