'use server'

import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import { hashPassword } from '@/lib/utils/password'
import { logCreate, logUpdate, logDelete } from '@/features/audit/services'
import { createAuditData, softDelete } from '@/lib/utils/prisma-helpers'

// Check if user is Super Admin
async function checkSuperAdmin() {
  const user = await getCurrentUser()
  if (!user || !user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)) {
    throw new Error('Unauthorized: Super Admin access required')
  }
  return user
}

/**
 * Get all roles with their assigned permissions
 */
export async function getRolePermissionsAction() {
  await checkSuperAdmin()

  // Exclude SUPER_ADMIN role - it has all permissions by default
  const roles = await prisma.role.findMany({
    where: {
      type: { not: RoleType.SUPER_ADMIN },
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: { level: 'asc' },
  })

  // Get all permissions
  const allPermissions = await prisma.permission.findMany({
    orderBy: [{ resource: 'asc' }, { action: 'asc' }],
  })

  return roles.map(role => ({
    roleId: role.id,
    roleName: role.name,
    roleType: role.type,
    permissions: allPermissions.map(perm => ({
      id: perm.id,
      resource: perm.resource,
      action: perm.action,
      scope: perm.scope,
      enabled: role.rolePermissions.some(rp => rp.permissionId === perm.id),
    })),
  }))
}

/**
 * Update role permissions
 */
export async function updateRolePermissionsAction(roles: any[]) {
  const currentUser = await checkSuperAdmin()
  const profileId = currentUser.profile.id

  const changesLog: any[] = []

  for (const role of roles) {
    // Skip SUPER_ADMIN role - it should not be modified
    const roleData = await prisma.role.findUnique({
      where: { id: role.roleId },
      select: { type: true, name: true },
    })

    if (roleData?.type === RoleType.SUPER_ADMIN) {
      continue
    }

    // Get current permissions
    const currentPerms = await prisma.rolePermission.findMany({
      where: { roleId: role.roleId },
    })

    const currentPermIds = new Set(currentPerms.map(p => p.permissionId))
    const newPermIds = new Set<string>(
      role.permissions.filter((p: any) => p.enabled).map((p: any) => p.id as string)
    )

    // Track changes for audit log
    const addedPermIds = [...newPermIds].filter(id => !currentPermIds.has(id))
    const removedPermIds = [...currentPermIds].filter(id => !newPermIds.has(id))

    if (addedPermIds.length > 0 || removedPermIds.length > 0) {
      changesLog.push({
        roleId: role.roleId,
        roleName: roleData?.name,
        permissionsAdded: addedPermIds.length,
        permissionsRemoved: removedPermIds.length,
      })
    }

    // Add new permissions with audit trail
    for (const permId of newPermIds) {
      if (!currentPermIds.has(permId)) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.roleId,
            permissionId: permId,
            ...createAuditData(profileId),
          },
        })
      }
    }

    // Soft delete revoked permissions
    for (const permId of currentPermIds) {
      if (!newPermIds.has(permId)) {
        await prisma.rolePermission.updateMany({
          where: {
            roleId: role.roleId,
            permissionId: permId,
          },
          data: {
            deletedAt: new Date(),
            deletedBy: profileId,
          },
        })
      }
    }
  }

  // Log permission matrix changes to audit log
  if (changesLog.length > 0) {
    await logUpdate(
      'role_permissions',
      'bulk_update',
      {
        summary: `Permission matrix before update`,
        rolesCount: roles.length,
      },
      {
        summary: `Updated permissions for ${changesLog.length} role(s)`,
        changes: changesLog,
        totalPermissionsAdded: changesLog.reduce((sum, c) => sum + c.permissionsAdded, 0),
        totalPermissionsRemoved: changesLog.reduce((sum, c) => sum + c.permissionsRemoved, 0),
      }
    )
  }

  return { success: true, message: 'Permissions updated successfully' }
}

/**
 * Check if sample data has been deployed
 */
export async function checkSampleDataDeployedAction() {
  await checkSuperAdmin()

  // Check for sample branches (MLG, JOG, SJOG)
  const sampleBranches = await prisma.branch.findMany({
    where: {
      code: {
        in: ['MLG', 'JOG', 'SJOG'],
      },
    },
  })

  return {
    deployed: sampleBranches.length > 0,
    count: sampleBranches.length,
  }
}

/**
 * Seed sample test data
 */
export async function seedSampleDataAction() {
  const currentUser = await checkSuperAdmin()
  const profileId = currentUser.profile.id

  // Check if sample data already exists
  const sampleCheck = await checkSampleDataDeployedAction()
  if (sampleCheck.deployed) {
    return {
      success: false,
      error: 'Sample data already deployed. Please reset database first to avoid duplication.',
    }
  }

  const supabase = createAdminClient()

  // Create branches with audit trail
  const mlgBranch = await prisma.branch.create({
    data: {
      name: 'Malang Branch',
      code: 'MLG',
      type: 'BRANCH',
      parentId: (await prisma.branch.findFirst({ where: { type: 'HEADQUARTERS' } }))?.id,
      address: 'Jl. Raya Malang No. 123',
      phone: '0341-123456',
      email: 'mlg@test.com',
      ...createAuditData(profileId),
    },
  })

  const jogBranch = await prisma.branch.create({
    data: {
      name: 'Jogja Branch',
      code: 'JOG',
      type: 'BRANCH',
      parentId: (await prisma.branch.findFirst({ where: { type: 'HEADQUARTERS' } }))?.id,
      address: 'Jl. Malioboro No. 456',
      phone: '0274-654321',
      email: 'jog@test.com',
      ...createAuditData(profileId),
    },
  })

  const sjogBranch = await prisma.branch.create({
    data: {
      name: 'Sub Jogja Branch',
      code: 'SJOG',
      type: 'SUB_BRANCH',
      parentId: jogBranch.id,
      address: 'Jl. Solo No. 789',
      phone: '0274-999888',
      email: 'sjog@test.com',
      ...createAuditData(profileId),
    },
  })

  // Get roles
  const regionalMgr = await prisma.role.findFirst({ where: { type: 'REGIONAL_MANAGER' } })
  const branchMgr = await prisma.role.findFirst({ where: { type: 'BRANCH_MANAGER' } })
  const adminStaff = await prisma.role.findFirst({ where: { type: 'ADMIN_STAFF' } })
  const technician = await prisma.role.findFirst({ where: { type: 'TECHNICIAN' } })
  const userRole = await prisma.role.findFirst({ where: { type: 'USER' } })
  const hqBranch = await prisma.branch.findFirst({ where: { type: 'HEADQUARTERS' } })

  // Helper to create user
  const createUser = async (email: string, fullName: string, roleId: string, branchId: string) => {
    const { data: authUser } = await supabase.auth.admin.createUser({
      email,
      password: 'test1234',
      email_confirm: true,
    })

    if (authUser.user) {
      await prisma.user.create({
        data: {
          id: authUser.user.id,
          email,
          ...createAuditData(profileId),
          profile: {
            create: {
              fullName,
              branchId,
              ...createAuditData(profileId),
              userRoles: {
                create: {
                  roleId,
                  ...createAuditData(profileId),
                },
              },
            },
          },
        },
      })
    }
  }

  // Create users
  await createUser('gm@test.com', 'General Manager', regionalMgr!.id, hqBranch!.id)
  await createUser('bm_mlg@test.com', 'Branch Manager Malang', branchMgr!.id, mlgBranch.id)
  await createUser('bm_jog@test.com', 'Branch Manager Jogja', branchMgr!.id, jogBranch.id)
  await createUser('sa_mlg@test.com', 'Staff Admin Malang', adminStaff!.id, mlgBranch.id)
  await createUser('sa_jog@test.com', 'Staff Admin Jogja', adminStaff!.id, jogBranch.id)
  await createUser('sa_sjog@test.com', 'Staff Admin Sub Jogja', adminStaff!.id, sjogBranch.id)
  await createUser('tech_mlg@test.com', 'Technician Malang', technician!.id, mlgBranch.id)
  await createUser('tech_jog@test.com', 'Technician Jogja', technician!.id, jogBranch.id)
  await createUser('user_mlg@test.com', 'User Malang', userRole!.id, mlgBranch.id)
  await createUser('user_jog@test.com', 'User Jogja', userRole!.id, jogBranch.id)

  // Log data seeding to audit log
  await logCreate('system_data', 'seed_operation', {
    action: 'seed_sample_data',
    created: {
      branches: 3,
      users: 10,
    },
    branches: [
      { name: 'Malang Branch', code: 'MLG' },
      { name: 'Jogja Branch', code: 'JOG' },
      { name: 'Sub Jogja Branch', code: 'SJOG' },
    ],
    testPassword: 'test1234',
  })

  return {
    success: true,
    message: 'Sample data seeded: 10 users, 3 branches created',
  }
}

/**
 * Reset database to clean state
 * Note: Uses hard delete (not soft delete) for complete cleanup
 * This is an administrative function for removing test data
 */
export async function resetDatabaseAction() {
  await checkSuperAdmin()

  const supabase = createAdminClient()

  // Get super admin
  const superAdmin = await prisma.user.findFirst({
    where: { email: 'admin@repairshop.com' },
  })

  const hqBranch = await prisma.branch.findFirst({
    where: { type: 'HEADQUARTERS' },
  })

  // Delete all users except super admin
  const usersToDelete = await prisma.user.findMany({
    where: { id: { not: superAdmin?.id } },
  })

  // Count branches before deletion
  const branchesToDelete = await prisma.branch.count({
    where: { id: { not: hqBranch?.id } },
  })

  // Count audit logs before deletion
  const auditLogsCount = await prisma.auditLog.count()

  for (const user of usersToDelete) {
    // Delete from Supabase Auth
    await supabase.auth.admin.deleteUser(user.id)
    // Delete from database (cascade will handle profile and roles)
    await prisma.user.delete({ where: { id: user.id } })
  }

  // Delete all branches except HQ
  await prisma.branch.deleteMany({
    where: { id: { not: hqBranch?.id } },
  })

  // Delete all audit logs
  await prisma.auditLog.deleteMany({})

  // Log database reset to audit log (after other logs deleted, so this becomes the first entry)
  await logDelete('system_data', 'reset_operation', {
    action: 'database_reset',
    deleted: {
      users: usersToDelete.length,
      branches: branchesToDelete,
      auditLogs: auditLogsCount,
    },
    preserved: {
      superAdmin: superAdmin?.email || 'Unknown',
      headquarters: hqBranch?.name || 'Unknown',
    },
    warning: 'All test data has been permanently deleted',
  })

  return {
    success: true,
    message: 'Database reset: All test data deleted, Super Admin preserved',
  }
}
