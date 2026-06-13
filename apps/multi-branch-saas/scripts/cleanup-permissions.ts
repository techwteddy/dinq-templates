/**
 * Script to clean up mismatched permission data
 * Removes 'reports' and 'tickets' permissions that don't correspond to actual tables
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking for mismatched permissions...\n')

  // Step 1: Check current resources
  const allPermissions = await prisma.permission.findMany({
    select: {
      id: true,
      resource: true,
      action: true,
      scope: true,
    },
    orderBy: {
      resource: 'asc',
    },
  })

  // Group by resource
  const resourceCounts = allPermissions.reduce(
    (acc, perm) => {
      acc[perm.resource] = (acc[perm.resource] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  console.log('📊 Current resources in Permission table:')
  Object.entries(resourceCounts).forEach(([resource, count]) => {
    console.log(`  - ${resource}: ${count} permissions`)
  })
  console.log()

  // Step 2: Find mismatched permissions
  const mismatchedResources = ['reports', 'tickets']
  const mismatchedPermissions = allPermissions.filter(p => mismatchedResources.includes(p.resource))

  if (mismatchedPermissions.length === 0) {
    console.log('✅ No mismatched permissions found! Database is clean.')
    return
  }

  console.log(`⚠️  Found ${mismatchedPermissions.length} mismatched permissions:`)
  mismatchedResources.forEach(resource => {
    const count = mismatchedPermissions.filter(p => p.resource === resource).length
    if (count > 0) {
      console.log(`  - ${resource}: ${count} permissions`)
    }
  })
  console.log()

  // Step 3: Check role_permissions that will be affected
  const affectedRolePermissions = await prisma.rolePermission.findMany({
    where: {
      permissionId: {
        in: mismatchedPermissions.map(p => p.id),
      },
    },
    include: {
      role: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  })

  console.log(`🔗 Found ${affectedRolePermissions.length} role_permissions entries to delete:`)
  const roleCount = affectedRolePermissions.reduce(
    (acc, rp) => {
      acc[rp.role.name] = (acc[rp.role.name] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  Object.entries(roleCount).forEach(([role, count]) => {
    console.log(`  - ${role}: ${count} assignments`)
  })
  console.log()

  // Step 4: Delete role_permissions first (foreign key constraint)
  console.log('🗑️  Deleting role_permissions entries...')
  const deletedRolePermissions = await prisma.rolePermission.deleteMany({
    where: {
      permissionId: {
        in: mismatchedPermissions.map(p => p.id),
      },
    },
  })
  console.log(`✅ Deleted ${deletedRolePermissions.count} role_permissions entries\n`)

  // Step 5: Delete permissions
  console.log('🗑️  Deleting mismatched permissions...')
  const deletedPermissions = await prisma.permission.deleteMany({
    where: {
      resource: {
        in: mismatchedResources,
      },
    },
  })
  console.log(`✅ Deleted ${deletedPermissions.count} permissions\n`)

  // Step 6: Verify cleanup
  console.log('🔍 Verifying cleanup...')
  const remainingResources = await prisma.permission.findMany({
    select: {
      resource: true,
    },
    distinct: ['resource'],
    orderBy: {
      resource: 'asc',
    },
  })

  console.log('📊 Remaining resources in Permission table:')
  remainingResources.forEach(({ resource }) => {
    console.log(`  - ${resource}`)
  })
  console.log()

  console.log('✅ Cleanup completed successfully!')
  console.log('💡 Expected resources: audit_logs, branches, permissions, roles, users')
}

main()
  .catch(error => {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
