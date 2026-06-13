'use client'

import { useEffect, useState, useCallback } from 'react'
import { PermissionScope } from '@/lib/generated/prisma'
import {
  checkPermissionAction,
  checkAnyPermissionAction,
  checkAllPermissionsAction,
  getCurrentUserPermissionsAction,
} from '@/features/auth/actions/check-permissions'
import type { PermissionCheck } from '@/lib/rbac'

/**
 * Hook to check user permissions
 */
export function usePermissions() {
  const [userPermissions, setUserPermissions] = useState<PermissionCheck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await getCurrentUserPermissionsAction()
        setUserPermissions(permissions)
      } catch (error) {
        console.error('Error fetching permissions:', error)
        setUserPermissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  const checkPermission = useCallback(
    async (resource: string, action: string, scope: PermissionScope): Promise<boolean> => {
      try {
        return await checkPermissionAction(resource, action, scope)
      } catch (error) {
        console.error('Error checking permission:', error)
        return false
      }
    },
    []
  )

  const checkAny = useCallback(async (permissions: PermissionCheck[]): Promise<boolean> => {
    try {
      return await checkAnyPermissionAction(permissions)
    } catch (error) {
      console.error('Error checking permissions:', error)
      return false
    }
  }, [])

  const checkAll = useCallback(async (permissions: PermissionCheck[]): Promise<boolean> => {
    try {
      return await checkAllPermissionsAction(permissions)
    } catch (error) {
      console.error('Error checking permissions:', error)
      return false
    }
  }, [])

  const hasPermission = useCallback(
    (resource: string, action: string, scope: PermissionScope): boolean => {
      return userPermissions.some(
        p => p.resource === resource && p.action === action && p.scope === scope
      )
    },
    [userPermissions]
  )

  return {
    permissions: userPermissions,
    loading,
    checkPermission,
    checkAny,
    checkAll,
    hasPermission,
  }
}
