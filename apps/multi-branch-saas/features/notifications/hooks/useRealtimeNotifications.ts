'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseRealtimeNotificationsOptions {
  profileId?: string
  onUpdate?: () => void
}

/**
 * Hook for real-time notification updates
 * Subscribes to changes in the notifications table for the current user
 */
export function useRealtimeNotifications(options?: UseRealtimeNotificationsOptions) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const { profileId, onUpdate } = options || {}

  useEffect(() => {
    if (!profileId) {
      return
    }

    const supabase = createClient()

    // Subscribe to notifications table changes for current user
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notifications',
          filter: `profile_id=eq.${profileId}`, // Only listen to current user's notifications
        },
        payload => {
          console.log('Notification change detected:', payload)

          // Update timestamp to trigger re-fetch
          setLastUpdate(new Date())

          // Call custom callback if provided
          if (onUpdate) {
            onUpdate()
          }

          // Note: We don't show toast here because the NotificationBell component
          // will handle updating the unread count and the user can see the bell badge
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [profileId, onUpdate])

  return { lastUpdate }
}
