'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import { logCreate, logUpdate, logDelete } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'
import { revalidatePath } from 'next/cache'

// Check if user is Super Admin
async function checkSuperAdmin() {
  const user = await getCurrentUser()
  if (!user || !user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)) {
    throw new Error('Unauthorized: Super Admin access required')
  }
  return user
}

/**
 * Get all roles (excluding SUPER_ADMIN for safety)
 */
export async function getRolesAction() {
  await checkSuperAdmin()

  const roles = await prisma.role.findMany({
    where: {
      type: { not: RoleType.SUPER_ADMIN },
    },
    include: {
      _count: {
        select: {
          userRoles: true,
          rolePermissions: true,
        },
      },
    },
    orderBy: { level: 'asc' },
  })

  return roles.map(role => ({
    id: role.id,
    name: role.name,
    type: role.type,
    level: role.level,
    description: role.description,
    userCount: role._count.userRoles,
    permissionCount: role._count.rolePermissions,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }))
}

/**
 * Get single role by ID
 */
export async function getRoleByIdAction(roleId: string) {
  await checkSuperAdmin()

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      _count: {
        select: {
          userRoles: true,
          rolePermissions: true,
        },
      },
    },
  })

  if (!role) {
    throw new Error('Role not found')
  }

  return {
    id: role.id,
    name: role.name,
    type: role.type,
    level: role.level,
    description: role.description,
    userCount: role._count.userRoles,
    permissionCount: role._count.rolePermissions,
  }
}

type CreateRoleInput = {
  name: string
  type: RoleType
  level: number
  description?: string
}

/**
 * Create new role
 */
export async function createRoleAction(
  data: CreateRoleInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await checkSuperAdmin()

    // Validate level (2-6, SUPER_ADMIN is 1)
    if (data.level < 2 || data.level > 6) {
      return {
        success: false,
        error: 'Role level must be between 2 and 6',
      }
    }

    // Check if role type already exists
    const existing = await prisma.role.findFirst({
      where: { type: data.type },
    })

    if (existing) {
      return {
        success: false,
        error: `Role type ${data.type} already exists`,
      }
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name: data.name,
        type: data.type,
        level: data.level,
        description: data.description || null,
      },
    })

    // Log the creation
    await logCreate('roles', role.id, {
      name: role.name,
      type: role.type,
      level: role.level,
      description: role.description,
    })

    revalidatePath('/admin/dev-tools')

    return {
      success: true,
      message: 'Role created successfully',
      data: { id: role.id },
    }
  } catch (error) {
    console.error('Error creating role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create role',
    }
  }
}

type UpdateRoleInput = {
  id: string
  name: string
  description?: string
}

/**
 * Update role (only name and description, not type or level)
 */
export async function updateRoleAction(data: UpdateRoleInput): Promise<ActionResult> {
  try {
    await checkSuperAdmin()

    const existing = await prisma.role.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return {
        success: false,
        error: 'Role not found',
      }
    }

    // Cannot edit SUPER_ADMIN
    if (existing.type === RoleType.SUPER_ADMIN) {
      return {
        success: false,
        error: 'Cannot edit Super Admin role',
      }
    }

    const updated = await prisma.role.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
      },
    })

    // Log the update
    await logUpdate(
      'roles',
      updated.id,
      {
        name: existing.name,
        description: existing.description,
      },
      {
        name: updated.name,
        description: updated.description,
      }
    )

    revalidatePath('/admin/dev-tools')

    return {
      success: true,
      message: 'Role updated successfully',
    }
  } catch (error) {
    console.error('Error updating role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update role',
    }
  }
}

/**
 * Delete role
 */
export async function deleteRoleAction(roleId: string): Promise<ActionResult> {
  try {
    await checkSuperAdmin()

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    })

    if (!role) {
      return {
        success: false,
        error: 'Role not found',
      }
    }

    // Cannot delete SUPER_ADMIN
    if (role.type === RoleType.SUPER_ADMIN) {
      return {
        success: false,
        error: 'Cannot delete Super Admin role',
      }
    }

    // Cannot delete if users are assigned
    if (role._count.userRoles > 0) {
      return {
        success: false,
        error: `Cannot delete role: ${role._count.userRoles} user(s) currently assigned to this role`,
      }
    }

    // Delete role permissions first
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    })

    // Delete role
    await prisma.role.delete({
      where: { id: roleId },
    })

    // Log the deletion
    await logDelete('roles', roleId, {
      name: role.name,
      type: role.type,
      level: role.level,
      description: role.description,
    })

    revalidatePath('/admin/dev-tools')

    return {
      success: true,
      message: 'Role deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete role',
    }
  }
}
