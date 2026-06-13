import {
  PrismaClient,
  RoleType,
  PermissionScope,
  BranchType,
  UserStatus,
} from '../lib/generated/prisma'
import { createAdminClient } from '../lib/supabase/admin'

const prisma = new PrismaClient()

async function seedRoles() {
  console.log('🔐 Seeding roles...')

  const roles = [
    {
      name: 'Super Admin',
      type: RoleType.SUPER_ADMIN,
      level: 1,
      description: 'Full system access, can manage everything across all branches',
    },
    {
      name: 'Regional Manager',
      type: RoleType.REGIONAL_MANAGER,
      level: 2,
      description: 'Can manage multiple branches in a region',
    },
    {
      name: 'Branch Manager',
      type: RoleType.BRANCH_MANAGER,
      level: 3,
      description: 'Can manage own branch and sub-branches',
    },
    {
      name: 'Admin Staff',
      type: RoleType.ADMIN_STAFF,
      level: 4,
      description: 'Administrative tasks within branch',
    },
    {
      name: 'Technician',
      type: RoleType.TECHNICIAN,
      level: 5,
      description: 'Technical work and repairs',
    },
    {
      name: 'User',
      type: RoleType.USER,
      level: 6,
      description: 'Basic user access',
    },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { type: role.type },
      update: {},
      create: role,
    })
  }

  console.log('✅ Roles seeded successfully')
}

async function seedPermissions() {
  console.log('🔑 Seeding permissions...')

  const resources = ['users', 'branches', 'roles', 'permissions', 'audit_logs']
  const actions = ['create', 'read', 'update', 'delete']
  const scopes = [
    PermissionScope.OWN,
    PermissionScope.BRANCH,
    PermissionScope.REGION,
    PermissionScope.ALL,
  ]

  const permissions = []

  // Generate all permission combinations
  for (const resource of resources) {
    for (const action of actions) {
      for (const scope of scopes) {
        permissions.push({
          resource,
          action,
          scope,
          description: `${action} ${resource} in ${scope.toLowerCase()} scope`,
        })
      }
    }
  }

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action_scope: {
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope,
        },
      },
      update: {},
      create: permission,
    })
  }

  console.log(`✅ ${permissions.length} permissions seeded successfully`)
}

async function seedRolePermissions(createdByProfileId?: string) {
  console.log('🔗 Assigning permissions to roles...')

  // Get all roles and permissions
  const superAdmin = await prisma.role.findUnique({ where: { type: RoleType.SUPER_ADMIN } })
  const regionalManager = await prisma.role.findUnique({
    where: { type: RoleType.REGIONAL_MANAGER },
  })
  const branchManager = await prisma.role.findUnique({ where: { type: RoleType.BRANCH_MANAGER } })
  const adminStaff = await prisma.role.findUnique({ where: { type: RoleType.ADMIN_STAFF } })
  const technician = await prisma.role.findUnique({ where: { type: RoleType.TECHNICIAN } })
  const user = await prisma.role.findUnique({ where: { type: RoleType.USER } })

  // Super Admin - ALL scope for everything
  if (superAdmin) {
    const allPermissions = await prisma.permission.findMany({
      where: { scope: PermissionScope.ALL },
    })

    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdmin.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdmin.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  // Regional Manager - REGION scope
  if (regionalManager) {
    const regionPermissions = await prisma.permission.findMany({
      where: {
        scope: { in: [PermissionScope.REGION, PermissionScope.BRANCH, PermissionScope.OWN] },
        resource: { in: ['users', 'branches', 'roles', 'audit_logs'] },
      },
    })

    for (const permission of regionPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: regionalManager.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: regionalManager.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  // Branch Manager - BRANCH scope
  if (branchManager) {
    const branchPermissions = await prisma.permission.findMany({
      where: {
        scope: { in: [PermissionScope.BRANCH, PermissionScope.OWN] },
        resource: { in: ['users', 'branches', 'audit_logs'] },
      },
    })

    for (const permission of branchPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: branchManager.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: branchManager.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  // Admin Staff - BRANCH scope (limited)
  if (adminStaff) {
    const adminPermissions = await prisma.permission.findMany({
      where: {
        scope: { in: [PermissionScope.BRANCH, PermissionScope.OWN] },
        resource: { in: ['users', 'audit_logs'] },
      },
    })

    for (const permission of adminPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminStaff.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminStaff.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  // Technician - OWN scope
  if (technician) {
    const techPermissions = await prisma.permission.findMany({
      where: {
        scope: PermissionScope.OWN,
        resource: { in: ['users'] },
      },
    })

    for (const permission of techPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: technician.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: technician.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  // User - OWN scope (read only)
  if (user) {
    const userPermissions = await prisma.permission.findMany({
      where: {
        scope: PermissionScope.OWN,
        action: 'read',
        resource: { in: ['users'] },
      },
    })

    for (const permission of userPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: user.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: user.id,
          permissionId: permission.id,
          createdBy: createdByProfileId,
        },
      })
    }
  }

  console.log('✅ Role permissions assigned successfully')
}

async function seedBranches() {
  console.log('🏢 Seeding branches...')

  const hqBranch = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {},
    create: {
      name: 'Headquarters',
      code: 'HQ',
      type: BranchType.HEADQUARTERS,
      address: 'Main Office Address',
      phone: '+62-21-1234567',
      email: 'hq@repairshop.com',
      isActive: true,
    },
  })

  console.log('✅ HQ branch created:', hqBranch.name)
}

async function seedSuperAdmin() {
  console.log('👤 Seeding super admin user...')

  const ADMIN_EMAIL = 'admin@repairshop.com'
  const ADMIN_PASSWORD = 'Admin123!' // Strong default password

  // Create admin user in Supabase Auth first
  const supabase = createAdminClient()

  // Check if auth user already exists
  const { data: existingAuthUsers } = await supabase.auth.admin.listUsers()
  const existingAuthUser = existingAuthUsers.users.find(u => u.email === ADMIN_EMAIL)

  let authUserId: string

  if (existingAuthUser) {
    console.log('ℹ️  Auth user already exists, using existing ID')
    authUserId = existingAuthUser.id
  } else {
    // Create new auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Administrator',
      },
    })

    if (authError || !authData.user) {
      throw new Error(`Failed to create auth user: ${authError?.message}`)
    }

    authUserId = authData.user.id
    console.log('✅ Supabase Auth user created')
  }

  // Create user in database
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      id: authUserId, // Use Supabase auth user ID
      email: ADMIN_EMAIL,
    },
  })

  // Get HQ branch
  const hqBranch = await prisma.branch.findUnique({
    where: { code: 'HQ' },
  })

  if (!hqBranch) {
    throw new Error('HQ branch not found')
  }

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      fullName: 'Super Administrator',
      phone: '+62-812-3456-7890',
      status: UserStatus.ACTIVE,
      branchId: hqBranch.id,
    },
  })

  // Get Super Admin role
  const superAdminRole = await prisma.role.findUnique({
    where: { type: RoleType.SUPER_ADMIN },
  })

  if (!superAdminRole) {
    throw new Error('Super Admin role not found')
  }

  // Assign role to user
  await prisma.userRole.upsert({
    where: {
      profileId_roleId: {
        profileId: profile.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      profileId: profile.id,
      roleId: superAdminRole.id,
      createdBy: profile.id, // Super Admin creates their own role assignment
    },
  })

  console.log('✅ Super admin user created')
  console.log('📧 Email:', ADMIN_EMAIL)
  console.log('🔑 Password:', ADMIN_PASSWORD)
  console.log('⚠️  Please change this password after first login!')

  return profile // Return profile for use in subsequent seeding
}

async function main() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Step 1: Create HQ branch (no createdBy yet as no users exist)
    await seedBranches()

    // Step 2: Create roles (no createdBy yet)
    await seedRoles()

    // Step 3: Create permissions (no createdBy yet)
    await seedPermissions()

    // Step 4: Create Super Admin user FIRST
    const superAdminProfile = await seedSuperAdmin()

    // Step 5: Now assign role permissions WITH createdBy
    await seedRolePermissions(superAdminProfile.id)

    // Step 6: Update initial records with createdBy (optional but recommended)
    await updateInitialRecordsWithCreatedBy(superAdminProfile.id)

    console.log('\n✨ Database seeding completed successfully!')
    console.log('✅ All records now have audit trail information')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

/**
 * Update initial seeded records (branches, roles, permissions) with createdBy
 * This makes the audit trail complete from the start
 */
async function updateInitialRecordsWithCreatedBy(superAdminProfileId: string) {
  console.log('🔄 Updating initial records with audit trail...')

  // Update HQ branch
  await prisma.branch.updateMany({
    where: { code: 'HQ' },
    data: { createdBy: superAdminProfileId },
  })

  // Update all roles
  await prisma.role.updateMany({
    data: { createdBy: superAdminProfileId },
  })

  // Update all permissions
  await prisma.permission.updateMany({
    data: { createdBy: superAdminProfileId },
  })

  console.log('✅ Initial records updated with createdBy')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
