'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Hook for real-time user updates
 * Subscribes to changes in the users table and triggers re-fetch
 */
export function useRealtimeUsers(onUpdate?: () => void) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to users table changes
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'users',
        },
        payload => {
          console.log('User change detected:', payload)

          // Update timestamp to trigger re-fetch
          setLastUpdate(new Date())

          // Call custom callback if provided
          if (onUpdate) {
            onUpdate()
          }

          // Show notification based on event type
          if (payload.eventType === 'INSERT') {
            toast.info('New user added', {
              description: 'The user list has been updated',
            })
          } else if (payload.eventType === 'UPDATE') {
            toast.info('User updated', {
              description: 'User information has been modified',
            })
          } else if (payload.eventType === 'DELETE') {
            toast.info('User removed', {
              description: 'A user has been deleted',
            })
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [onUpdate])

  return { lastUpdate }
}
