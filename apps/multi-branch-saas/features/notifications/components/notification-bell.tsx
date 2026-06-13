'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { NotificationList } from './notification-list'
import { getUnreadCountAction } from '../actions'
import { useRealtimeNotifications } from '../hooks'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface NotificationBellProps {
  profileId: string
}

export function NotificationBell({ profileId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [isRinging, setIsRinging] = useState(false)
  const [previousCount, setPreviousCount] = useState(0)

  // Setup real-time notifications
  const { lastUpdate } = useRealtimeNotifications({
    profileId,
    onUpdate: () => {
      loadUnreadCount()
    },
  })

  useEffect(() => {
    loadUnreadCount()
  }, [lastUpdate])

  const loadUnreadCount = async () => {
    const count = await getUnreadCountAction()

    // Animate bell and show toast if count increased
    if (count > previousCount && previousCount > 0) {
      setIsRinging(true)
      toast.info('New notification received', {
        duration: 2000,
      })
      setTimeout(() => setIsRinging(false), 1000)
    }

    setPreviousCount(unreadCount)
    setUnreadCount(count)
  }

  const handleUpdate = () => {
    loadUnreadCount()
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell
            className={cn(
              'h-5 w-5 transition-transform',
              isRinging && 'animate-[wiggle_1s_ease-in-out]'
            )}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="animate-in fade-in zoom-in absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs duration-300"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="animate-in fade-in slide-in-from-top-2 w-[400px] p-0 duration-200"
        align="end"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <NotificationList onUpdate={handleUpdate} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}
