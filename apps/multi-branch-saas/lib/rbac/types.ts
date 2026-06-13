import { RoleType, PermissionScope } from '@/lib/generated/prisma'

export type UserRole = {
  id: string
  role: {
    id: string
    name: string
    type: RoleType
    level: number
  }
}

export type UserPermission = {
  resource: string
  action: string
  scope: PermissionScope
}

export type PermissionCheck = {
  resource: string
  action: string
  scope: PermissionScope
}

export type AccessLevel = 'own' | 'branch' | 'region' | 'all'

export type CheckPermissionOptions = {
  userId?: string
  branchId?: string
  resourceOwnerId?: string
}
