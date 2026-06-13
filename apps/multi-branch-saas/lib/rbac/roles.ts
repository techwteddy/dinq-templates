import { RoleType } from '@/lib/generated/prisma'

/**
 * Role hierarchy
 * Lower level number = higher permissions
 *
 * 1 - Super Admin (highest)
 * 2 - Regional Manager
 * 3 - Branch Manager
 * 4 - Admin Staff
 * 5 - Technician
 * 6 - User (lowest)
 */

export const ROLE_LEVELS = {
  SUPER_ADMIN: 1,
  REGIONAL_MANAGER: 2,
  BRANCH_MANAGER: 3,
  ADMIN_STAFF: 4,
  TECHNICIAN: 5,
  USER: 6,
} as const

export const ROLE_NAMES = {
  [RoleType.SUPER_ADMIN]: 'Super Admin',
  [RoleType.REGIONAL_MANAGER]: 'Regional Manager',
  [RoleType.BRANCH_MANAGER]: 'Branch Manager',
  [RoleType.ADMIN_STAFF]: 'Admin Staff',
  [RoleType.TECHNICIAN]: 'Technician',
  [RoleType.USER]: 'User',
} as const

export const ROLE_DESCRIPTIONS = {
  [RoleType.SUPER_ADMIN]: 'Full system access, can manage everything across all branches',
  [RoleType.REGIONAL_MANAGER]: 'Can manage multiple branches in a region',
  [RoleType.BRANCH_MANAGER]: 'Can manage own branch and sub-branches',
  [RoleType.ADMIN_STAFF]: 'Administrative tasks within branch',
  [RoleType.TECHNICIAN]: 'Technical work and repairs',
  [RoleType.USER]: 'Basic user access',
} as const

// Helper function to get role level
export function getRoleLevel(roleType: RoleType): number {
  switch (roleType) {
    case RoleType.SUPER_ADMIN:
      return ROLE_LEVELS.SUPER_ADMIN
    case RoleType.REGIONAL_MANAGER:
      return ROLE_LEVELS.REGIONAL_MANAGER
    case RoleType.BRANCH_MANAGER:
      return ROLE_LEVELS.BRANCH_MANAGER
    case RoleType.ADMIN_STAFF:
      return ROLE_LEVELS.ADMIN_STAFF
    case RoleType.TECHNICIAN:
      return ROLE_LEVELS.TECHNICIAN
    case RoleType.USER:
      return ROLE_LEVELS.USER
    default:
      return ROLE_LEVELS.USER
  }
}

// Helper function to check if role A is higher than role B
export function isRoleHigher(roleA: RoleType, roleB: RoleType): boolean {
  return getRoleLevel(roleA) < getRoleLevel(roleB)
}

// Helper function to check if role A is equal or higher than role B
export function isRoleEqualOrHigher(roleA: RoleType, roleB: RoleType): boolean {
  return getRoleLevel(roleA) <= getRoleLevel(roleB)
}

// Get all roles ordered by level (highest to lowest)
export function getAllRolesOrdered(): RoleType[] {
  return [
    RoleType.SUPER_ADMIN,
    RoleType.REGIONAL_MANAGER,
    RoleType.BRANCH_MANAGER,
    RoleType.ADMIN_STAFF,
    RoleType.TECHNICIAN,
    RoleType.USER,
  ]
}

// Get roles that can be assigned by a specific role
export function getAssignableRoles(roleType: RoleType): RoleType[] {
  const currentLevel = getRoleLevel(roleType)

  return getAllRolesOrdered().filter(role => {
    const roleLevel = getRoleLevel(role)
    // Can only assign roles at same level or lower (higher number)
    return roleLevel >= currentLevel
  })
}
