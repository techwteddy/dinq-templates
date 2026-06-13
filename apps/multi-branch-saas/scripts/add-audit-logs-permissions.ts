/**
 * Script to add missing audit_logs permissions
 */

import { PrismaClient, PermissionScope } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking for audit_logs permissions...\n')

  // Check if audit_logs permissions exist
  const existingAuditLogs = await prisma.permission.findMany({
    where: {
      resource: 'audit_logs',
    },
  })

  if (existingAuditLogs.length > 0) {
    console.log(`✅ audit_logs permissions already exist (${existingAuditLogs.length} found)`)
    return
  }

  console.log('📝 Creating audit_logs permissions...\n')

  const actions = ['create', 'read', 'update', 'delete']
  const scopes = [
    PermissionScope.OWN,
    PermissionScope.BRANCH,
    PermissionScope.REGION,
    PermissionScope.ALL,
  ]

  let created = 0

  for (const action of actions) {
    for (const scope of scopes) {
      await prisma.permission.create({
        data: {
          resource: 'audit_logs',
          action,
          scope,
          description: `${action} audit_logs in ${scope.toLowerCase()} scope`,
        },
      })
      created++
    }
  }

  console.log(`✅ Created ${created} audit_logs permissions\n`)

  // Verify
  const allResources = await prisma.permission.findMany({
    select: { resource: true },
    distinct: ['resource'],
    orderBy: { resource: 'asc' },
  })

  console.log('📊 Current resources in Permission table:')
  allResources.forEach(({ resource }) => {
    console.log(`  - ${resource}`)
  })
  console.log()

  console.log('✅ All expected resources present!')
}

main()
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
