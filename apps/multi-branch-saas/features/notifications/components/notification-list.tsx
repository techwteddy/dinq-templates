'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationItem } from './notification-item'
import { NotificationType } from '@/lib/generated/prisma'
import {
  getNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  deleteAllReadAction,
} from '../actions'
import type { NotificationListItem } from '../types'
import { toast } from 'sonner'
import { Loader2, Bell } from 'lucide-react'

interface NotificationListProps {
  initialNotifications?: NotificationListItem[]
  onUpdate?: () => void
  onClose?: () => void
}

export function NotificationList({
  initialNotifications = [],
  onUpdate,
  onClose,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationListItem[]>(initialNotifications)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    loadNotifications()
  }, [filter])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const result = await getNotificationsAction({
        isRead: filter === 'unread' ? false : undefined,
        limit: 50,
      })

      if (result) {
        setNotifications(result.data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    const result = await markAsReadAction(id)

    if (result.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n))
      )
      onUpdate?.()
    } else {
      toast.error(result.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsReadAction()

    if (result.success) {
      toast.success(result.message)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date() })))
      onUpdate?.()
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNotificationAction(id)

    if (result.success) {
      toast.success(result.message)
      setNotifications(prev => prev.filter(n => n.id !== id))
      onUpdate?.()
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteAllRead = async () => {
    const result = await deleteAllReadAction()

    if (result.success) {
      toast.success(result.message)
      setNotifications(prev => prev.filter(n => !n.isRead))
      onUpdate?.()
    } else {
      toast.error(result.message)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (notifications.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev < notifications.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < notifications.length) {
            const notification = notifications[selectedIndex]
            if (!notification.isRead) {
              handleMarkAsRead(notification.id)
            }
          }
          break
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < notifications.length) {
            handleDelete(notifications[selectedIndex].id)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [notifications, selectedIndex])

  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDeleteAllRead}>
            Clear read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={v => setFilter(v as 'all' | 'unread')}>
        <div className="border-b px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter} className="m-0">
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12">
                <Bell className="h-12 w-12 opacity-20" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="animate-in fade-in slide-in-from-left duration-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                      isSelected={index === selectedIndex}
                    />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
