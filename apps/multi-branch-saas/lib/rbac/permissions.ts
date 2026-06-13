import { PermissionScope } from '@/lib/generated/prisma'

/**
 * Permission format: {resource}:{action}:{scope}
 *
 * Resources: users, branches, roles, permissions, tickets, reports
 * Actions: create, read, update, delete
 * Scopes: OWN, BRANCH, REGION, ALL
 */

// Permission type
export type Permission = {
  resource: string
  action: string
  scope: PermissionScope
}

// Helper function to create permission string
export const createPermission = (
  resource: string,
  action: string,
  scope: PermissionScope
): string => {
  return `${resource}:${action}:${scope}`
}

// Helper function to parse permission string
export const parsePermission = (permission: string): Permission | null => {
  const parts = permission.split(':')
  if (parts.length !== 3) return null

  const [resource, action, scope] = parts
  if (!Object.values(PermissionScope).includes(scope as PermissionScope)) {
    return null
  }

  return {
    resource,
    action,
    scope: scope as PermissionScope,
  }
}

// ============================================
// USER PERMISSIONS
// ============================================

export const USER_PERMISSIONS = {
  CREATE_OWN: createPermission('users', 'create', PermissionScope.OWN),
  CREATE_BRANCH: createPermission('users', 'create', PermissionScope.BRANCH),
  CREATE_REGION: createPermission('users', 'create', PermissionScope.REGION),
  CREATE_ALL: createPermission('users', 'create', PermissionScope.ALL),

  READ_OWN: createPermission('users', 'read', PermissionScope.OWN),
  READ_BRANCH: createPermission('users', 'read', PermissionScope.BRANCH),
  READ_REGION: createPermission('users', 'read', PermissionScope.REGION),
  READ_ALL: createPermission('users', 'read', PermissionScope.ALL),

  UPDATE_OWN: createPermission('users', 'update', PermissionScope.OWN),
  UPDATE_BRANCH: createPermission('users', 'update', PermissionScope.BRANCH),
  UPDATE_REGION: createPermission('users', 'update', PermissionScope.REGION),
  UPDATE_ALL: createPermission('users', 'update', PermissionScope.ALL),

  DELETE_OWN: createPermission('users', 'delete', PermissionScope.OWN),
  DELETE_BRANCH: createPermission('users', 'delete', PermissionScope.BRANCH),
  DELETE_REGION: createPermission('users', 'delete', PermissionScope.REGION),
  DELETE_ALL: createPermission('users', 'delete', PermissionScope.ALL),
} as const

// ============================================
// BRANCH PERMISSIONS
// ============================================

export const BRANCH_PERMISSIONS = {
  CREATE_OWN: createPermission('branches', 'create', PermissionScope.OWN),
  CREATE_BRANCH: createPermission('branches', 'create', PermissionScope.BRANCH),
  CREATE_REGION: createPermission('branches', 'create', PermissionScope.REGION),
  CREATE_ALL: createPermission('branches', 'create', PermissionScope.ALL),

  READ_OWN: createPermission('branches', 'read', PermissionScope.OWN),
  READ_BRANCH: createPermission('branches', 'read', PermissionScope.BRANCH),
  READ_REGION: createPermission('branches', 'read', PermissionScope.REGION),
  READ_ALL: createPermission('branches', 'read', PermissionScope.ALL),

  UPDATE_OWN: createPermission('branches', 'update', PermissionScope.OWN),
  UPDATE_BRANCH: createPermission('branches', 'update', PermissionScope.BRANCH),
  UPDATE_REGION: createPermission('branches', 'update', PermissionScope.REGION),
  UPDATE_ALL: createPermission('branches', 'update', PermissionScope.ALL),

  DELETE_OWN: createPermission('branches', 'delete', PermissionScope.OWN),
  DELETE_BRANCH: createPermission('branches', 'delete', PermissionScope.BRANCH),
  DELETE_REGION: createPermission('branches', 'delete', PermissionScope.REGION),
  DELETE_ALL: createPermission('branches', 'delete', PermissionScope.ALL),
} as const

// ============================================
// ROLE PERMISSIONS
// ============================================

export const ROLE_PERMISSIONS = {
  CREATE_OWN: createPermission('roles', 'create', PermissionScope.OWN),
  CREATE_BRANCH: createPermission('roles', 'create', PermissionScope.BRANCH),
  CREATE_REGION: createPermission('roles', 'create', PermissionScope.REGION),
  CREATE_ALL: createPermission('roles', 'create', PermissionScope.ALL),

  READ_OWN: createPermission('roles', 'read', PermissionScope.OWN),
  READ_BRANCH: createPermission('roles', 'read', PermissionScope.BRANCH),
  READ_REGION: createPermission('roles', 'read', PermissionScope.REGION),
  READ_ALL: createPermission('roles', 'read', PermissionScope.ALL),

  UPDATE_OWN: createPermission('roles', 'update', PermissionScope.OWN),
  UPDATE_BRANCH: createPermission('roles', 'update', PermissionScope.BRANCH),
  UPDATE_REGION: createPermission('roles', 'update', PermissionScope.REGION),
  UPDATE_ALL: createPermission('roles', 'update', PermissionScope.ALL),

  DELETE_OWN: createPermission('roles', 'delete', PermissionScope.OWN),
  DELETE_BRANCH: createPermission('roles', 'delete', PermissionScope.BRANCH),
  DELETE_REGION: createPermission('roles', 'delete', PermissionScope.REGION),
  DELETE_ALL: createPermission('roles', 'delete', PermissionScope.ALL),
} as const

// ============================================
// PERMISSION PERMISSIONS
// ============================================

export const PERMISSION_PERMISSIONS = {
  CREATE_OWN: createPermission('permissions', 'create', PermissionScope.OWN),
  CREATE_BRANCH: createPermission('permissions', 'create', PermissionScope.BRANCH),
  CREATE_REGION: createPermission('permissions', 'create', PermissionScope.REGION),
  CREATE_ALL: createPermission('permissions', 'create', PermissionScope.ALL),

  READ_OWN: createPermission('permissions', 'read', PermissionScope.OWN),
  READ_BRANCH: createPermission('permissions', 'read', PermissionScope.BRANCH),
  READ_REGION: createPermission('permissions', 'read', PermissionScope.REGION),
  READ_ALL: createPermission('permissions', 'read', PermissionScope.ALL),

  UPDATE_OWN: createPermission('permissions', 'update', PermissionScope.OWN),
  UPDATE_BRANCH: createPermission('permissions', 'update', PermissionScope.BRANCH),
  UPDATE_REGION: createPermission('permissions', 'update', PermissionScope.REGION),
  UPDATE_ALL: createPermission('permissions', 'update', PermissionScope.ALL),

  DELETE_OWN: createPermission('permissions', 'delete', PermissionScope.OWN),
  DELETE_BRANCH: createPermission('permissions', 'delete', PermissionScope.BRANCH),
  DELETE_REGION: createPermission('permissions', 'delete', PermissionScope.REGION),
  DELETE_ALL: createPermission('permissions', 'delete', PermissionScope.ALL),
} as const

// ============================================
// ALL PERMISSIONS
// ============================================

export const PERMISSIONS = {
  USERS: USER_PERMISSIONS,
  BRANCHES: BRANCH_PERMISSIONS,
  ROLES: ROLE_PERMISSIONS,
  PERMISSIONS: PERMISSION_PERMISSIONS,
} as const
