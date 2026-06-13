'use server'

import { PermissionScope } from '@/lib/generated/prisma'
import {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  getCurrentUserPermissions,
} from '@/lib/rbac'
import type { PermissionCheck } from '@/lib/rbac'

export async function checkPermissionAction(
  resource: string,
  action: string,
  scope: PermissionScope
): Promise<boolean> {
  return await checkPermission(resource, action, scope)
}

export async function checkAnyPermissionAction(permissions: PermissionCheck[]): Promise<boolean> {
  return await checkAnyPermission(permissions)
}

export async function checkAllPermissionsAction(permissions: PermissionCheck[]): Promise<boolean> {
  return await checkAllPermissions(permissions)
}

export async function getCurrentUserPermissionsAction(): Promise<PermissionCheck[]> {
  return await getCurrentUserPermissions()
}
