'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Hook for real-time branch updates
 * Subscribes to changes in the branches table and triggers re-fetch
 */
export function useRealtimeBranches(onUpdate?: () => void) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to branches table changes
    const channel = supabase
      .channel('branches-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'branches',
        },
        payload => {
          console.log('Branch change detected:', payload)

          // Update timestamp to trigger re-fetch
          setLastUpdate(new Date())

          // Call custom callback if provided
          if (onUpdate) {
            onUpdate()
          }

          // Show notification based on event type
          if (payload.eventType === 'INSERT') {
            toast.info('New branch added', {
              description: 'The branch list has been updated',
            })
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Branch updated', {
              description: 'Branch information has been modified',
            })
          } else if (payload.eventType === 'DELETE') {
            toast.info('Branch removed', {
              description: 'A branch has been deleted',
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
