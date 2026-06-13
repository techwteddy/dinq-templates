'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserAction } from '@/features/auth/actions/get-current-user'
import type { CurrentUser } from '@/features/auth/utils'

/**
 * Hook to get the current authenticated user
 * Returns null if user is not authenticated
 */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserAction()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching current user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}
