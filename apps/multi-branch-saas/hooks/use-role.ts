'use client'

import { useEffect, useState, useCallback } from 'react'
import { RoleType } from '@/lib/generated/prisma'
import {
  getCurrentUserRoleAction,
  hasRoleAction,
  hasRoleLevelAction,
} from '@/features/auth/actions/check-roles'
import { useCurrentUser } from './use-current-user'

type UserRoleData = {
  id: string
  name: string
  type: RoleType
  level: number
} | null

/**
 * Hook to check user roles
 */
export function useRole() {
  const { user, loading: userLoading } = useCurrentUser()
  const [currentRole, setCurrentRole] = useState<UserRoleData>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getCurrentUserRoleAction()
        setCurrentRole(role as UserRoleData)
      } catch (error) {
        console.error('Error fetching role:', error)
        setCurrentRole(null)
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) {
      if (user) {
        fetchRole()
      } else {
        setCurrentRole(null)
        setLoading(false)
      }
    }
  }, [user, userLoading])

  const hasRole = useCallback(async (roleType: RoleType): Promise<boolean> => {
    try {
      return await hasRoleAction(roleType)
    } catch (error) {
      console.error('Error checking role:', error)
      return false
    }
  }, [])

  const hasRoleLevel = useCallback(async (level: number): Promise<boolean> => {
    try {
      return await hasRoleLevelAction(level)
    } catch (error) {
      console.error('Error checking role level:', error)
      return false
    }
  }, [])

  const isRole = useCallback(
    (roleType: RoleType): boolean => {
      if (!user) return false
      return user.profile.userRoles.some(ur => ur.role.type === roleType)
    },
    [user]
  )

  const isSuperAdmin = useCallback(() => {
    return isRole(RoleType.SUPER_ADMIN)
  }, [isRole])

  const isRegionalManager = useCallback(() => {
    return isRole(RoleType.REGIONAL_MANAGER)
  }, [isRole])

  const isBranchManager = useCallback(() => {
    return isRole(RoleType.BRANCH_MANAGER)
  }, [isRole])

  const isAdminStaff = useCallback(() => {
    return isRole(RoleType.ADMIN_STAFF)
  }, [isRole])

  const isTechnician = useCallback(() => {
    return isRole(RoleType.TECHNICIAN)
  }, [isRole])

  const isUser = useCallback(() => {
    return isRole(RoleType.USER)
  }, [isRole])

  return {
    role: currentRole,
    loading,
    hasRole,
    hasRoleLevel,
    isRole,
    isSuperAdmin,
    isRegionalManager,
    isBranchManager,
    isAdminStaff,
    isTechnician,
    isUser,
  }
}
