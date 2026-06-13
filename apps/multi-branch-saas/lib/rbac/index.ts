// Permission constants
export {
  PERMISSIONS,
  USER_PERMISSIONS,
  BRANCH_PERMISSIONS,
  ROLE_PERMISSIONS,
  PERMISSION_PERMISSIONS,
  createPermission,
  parsePermission,
  type Permission,
} from './permissions'

// Role constants
export {
  ROLE_LEVELS,
  ROLE_NAMES,
  ROLE_DESCRIPTIONS,
  getRoleLevel,
  isRoleHigher,
  isRoleEqualOrHigher,
  getAllRolesOrdered,
  getAssignableRoles,
} from './roles'

// Permission checker functions
export {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  getCurrentUserPermissions,
  canAccessBranch,
  getAccessibleBranchIds,
} from './check-permission'

// Types
export type {
  UserRole,
  UserPermission,
  PermissionCheck,
  AccessLevel,
  CheckPermissionOptions,
} from './types'
