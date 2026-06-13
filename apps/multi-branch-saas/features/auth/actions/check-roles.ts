'use server'

import { getCurrentUserRole, hasRole, hasRoleLevel } from '@/features/auth/utils'

export async function getCurrentUserRoleAction() {
  return await getCurrentUserRole()
}

export async function hasRoleAction(roleType: string): Promise<boolean> {
  return await hasRole(roleType)
}

export async function hasRoleLevelAction(level: number): Promise<boolean> {
  return await hasRoleLevel(level)
}
