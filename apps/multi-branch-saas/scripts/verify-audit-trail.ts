/**
 * Verify Audit Trail Implementation
 * Checks that all seeded records have createdBy populated
 */

import { prisma } from '../lib/prisma'

async function verifyAuditTrail() {
  console.log('🔍 Verifying Audit Trail Implementation...\n')

  try {
    // Check Roles
    const rolesTotal = await prisma.role.count()
    const rolesWithCreatedBy = await prisma.role.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ ROLES: ${rolesWithCreatedBy}/${rolesTotal} have createdBy`)

    // Check Permissions
    const permsTotal = await prisma.permission.count()
    const permsWithCreatedBy = await prisma.permission.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ PERMISSIONS: ${permsWithCreatedBy}/${permsTotal} have createdBy`)

    // Check Role Permissions
    const rpTotal = await prisma.rolePermission.count()
    const rpWithCreatedBy = await prisma.rolePermission.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ ROLE_PERMISSIONS: ${rpWithCreatedBy}/${rpTotal} have createdBy`)

    // Check Branches
    const branchesTotal = await prisma.branch.count()
    const branchesWithCreatedBy = await prisma.branch.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ BRANCHES: ${branchesWithCreatedBy}/${branchesTotal} have createdBy`)

    // Check Users
    const usersTotal = await prisma.user.count()
    const usersWithCreatedBy = await prisma.user.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ USERS: ${usersWithCreatedBy}/${usersTotal} have createdBy`)

    // Check Profiles
    const profilesTotal = await prisma.profile.count()
    const profilesWithCreatedBy = await prisma.profile.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ PROFILES: ${profilesWithCreatedBy}/${profilesTotal} have createdBy`)

    // Check User Roles
    const urTotal = await prisma.userRole.count()
    const urWithCreatedBy = await prisma.userRole.count({
      where: { createdBy: { not: null } },
    })
    console.log(`✅ USER_ROLES: ${urWithCreatedBy}/${urTotal} have createdBy`)

    // Summary
    console.log('\n📊 Summary:')
    const allTotal =
      rolesTotal + permsTotal + rpTotal + branchesTotal + usersTotal + profilesTotal + urTotal
    const allWithCreatedBy =
      rolesWithCreatedBy +
      permsWithCreatedBy +
      rpWithCreatedBy +
      branchesWithCreatedBy +
      usersWithCreatedBy +
      profilesWithCreatedBy +
      urWithCreatedBy

    console.log(`Total records: ${allTotal}`)
    console.log(`Records with createdBy: ${allWithCreatedBy}`)
    console.log(`Coverage: ${((allWithCreatedBy / allTotal) * 100).toFixed(1)}%`)

    if (allWithCreatedBy === allTotal) {
      console.log('\n✅ SUCCESS: All seeded records have audit trail!')
    } else {
      console.log('\n⚠️  WARNING: Some records missing audit trail')
      console.log(`Missing: ${allTotal - allWithCreatedBy} records`)
    }

    // Check for soft-deleted records
    const deletedCount = await prisma.user.count({
      where: { deletedAt: { not: null } },
    })
    console.log(`\n🗑️  Soft-deleted users: ${deletedCount}`)

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error verifying audit trail:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

verifyAuditTrail()
