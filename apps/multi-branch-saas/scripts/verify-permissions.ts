/**
 * Script to verify permission data is correct
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying Permission Data...\n')

  // 1. Check all resources
  const resources = await prisma.permission.findMany({
    select: { resource: true },
    distinct: ['resource'],
    orderBy: { resource: 'asc' },
  })

  console.log('📊 Resources in Permission table:')
  const expectedResources = ['audit_logs', 'branches', 'permissions', 'roles', 'users']
  const actualResources = resources.map(r => r.resource)

  expectedResources.forEach(expected => {
    const exists = actualResources.includes(expected)
    console.log(`  ${exists ? '✅' : '❌'} ${expected}`)
  })

  // Check for unexpected resources
  const unexpected = actualResources.filter(r => !expectedResources.includes(r))
  if (unexpected.length > 0) {
    console.log('\n⚠️  Unexpected resources found:')
    unexpected.forEach(r => console.log(`  - ${r}`))
  }

  console.log()

  // 2. Count permissions per resource
  const permissionCounts = await prisma.permission.groupBy({
    by: ['resource'],
    _count: true,
  })

  console.log('📈 Permission counts by resource:')
  permissionCounts.forEach(({ resource, _count }) => {
    const expected = 16 // 4 actions × 4 scopes
    const status = _count === expected ? '✅' : '⚠️ '
    console.log(
      `  ${status} ${resource}: ${_count} permissions ${_count === expected ? '' : `(expected ${expected})`}`
    )
  })
  console.log()

  // 3. Check roles (excluding SUPER_ADMIN)
  const roles = await prisma.role.findMany({
    where: {
      type: { not: 'SUPER_ADMIN' },
    },
    select: {
      id: true,
      name: true,
      type: true,
      _count: {
        select: { rolePermissions: true },
      },
    },
    orderBy: { level: 'asc' },
  })

  console.log('👥 Roles (excluding SUPER_ADMIN):')
  roles.forEach(role => {
    console.log(`  ✅ ${role.name} (${role.type}): ${role._count.rolePermissions} permissions`)
  })
  console.log()

  // 4. Summary
  const totalPermissions = await prisma.permission.count()
  const totalRolePermissions = await prisma.rolePermission.count()
  const totalRoles = await prisma.role.count()

  console.log('📊 Summary:')
  console.log(`  • Total Permissions: ${totalPermissions}`)
  console.log(`  • Total Role Assignments: ${totalRolePermissions}`)
  console.log(`  • Total Roles: ${totalRoles}`)
  console.log()

  // 5. Final validation
  const isValid =
    actualResources.length === expectedResources.length &&
    expectedResources.every(r => actualResources.includes(r)) &&
    unexpected.length === 0

  if (isValid) {
    console.log('✅ All validations passed! Permission data is correct.')
  } else {
    console.log('⚠️  Some validations failed. Please review the output above.')
  }
}

main()
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
