/**
 * Script to restore role permissions based on updated seed
 * Admin Staff, Technician, and User roles lost permissions during cleanup
 */

import { PrismaClient, PermissionScope } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Restoring role permissions...\n')

  // Get roles
  const adminStaff = await prisma.role.findFirst({ where: { type: 'ADMIN_STAFF' } })
  const technician = await prisma.role.findFirst({ where: { type: 'TECHNICIAN' } })
  const user = await prisma.role.findFirst({ where: { type: 'USER' } })

  if (!adminStaff || !technician || !user) {
    console.error('❌ Could not find required roles')
    return
  }

  // Admin Staff - BRANCH scope (users, audit_logs)
  console.log('📝 Assigning permissions to Admin Staff...')
  const adminPermissions = await prisma.permission.findMany({
    where: {
      scope: { in: [PermissionScope.BRANCH, PermissionScope.OWN] },
      resource: { in: ['users', 'audit_logs'] },
    },
  })

  let adminCount = 0
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
      },
    })
    adminCount++
  }
  console.log(`✅ Assigned ${adminCount} permissions to Admin Staff\n`)

  // Technician - OWN scope (users only)
  console.log('📝 Assigning permissions to Technician...')
  const techPermissions = await prisma.permission.findMany({
    where: {
      scope: PermissionScope.OWN,
      resource: { in: ['users'] },
    },
  })

  let techCount = 0
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
      },
    })
    techCount++
  }
  console.log(`✅ Assigned ${techCount} permissions to Technician\n`)

  // User - OWN scope (read only on users)
  console.log('📝 Assigning permissions to User...')
  const userPermissions = await prisma.permission.findMany({
    where: {
      scope: PermissionScope.OWN,
      action: 'read',
      resource: { in: ['users'] },
    },
  })

  let userCount = 0
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
      },
    })
    userCount++
  }
  console.log(`✅ Assigned ${userCount} permissions to User\n`)

  // Verify
  console.log('🔍 Verifying role permissions...')
  const roles = await prisma.role.findMany({
    where: {
      type: { not: 'SUPER_ADMIN' },
    },
    select: {
      name: true,
      _count: {
        select: { rolePermissions: true },
      },
    },
    orderBy: { level: 'asc' },
  })

  roles.forEach(role => {
    console.log(`  ✅ ${role.name}: ${role._count.rolePermissions} permissions`)
  })

  console.log('\n✅ Role permissions restored successfully!')
}

main()
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
