import { prisma } from '@/lib/prisma'
import { getAccessibleBranchIds } from '@/lib/rbac'
import { withoutDeleted } from '@/lib/utils/prisma-helpers'
import { UserStatus } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import type { DashboardStats, RecentActivity } from '../types'

/**
 * Get dashboard statistics based on user's access level
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get accessible branch IDs for current user
    const accessibleBranchIds = await getAccessibleBranchIds()

    // Get total users count (in accessible branches)
    const totalUsers = await prisma.user.count({
      where: withoutDeleted({
        profile: {
          branchId: {
            in: accessibleBranchIds,
          },
        },
      }),
    })

    // Get active users count
    const activeUsers = await prisma.user.count({
      where: withoutDeleted({
        profile: {
          branchId: {
            in: accessibleBranchIds,
          },
          status: UserStatus.ACTIVE,
        },
      }),
    })

    // Get total branches count (accessible)
    const totalBranches = await prisma.branch.count({
      where: withoutDeleted({
        id: {
          in: accessibleBranchIds,
        },
      }),
    })

    // Get total roles count
    const totalRoles = await prisma.role.count({
      where: withoutDeleted({}),
    })

    return {
      totalUsers,
      activeUsers,
      totalBranches,
      totalRoles,
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    // Return zero stats on error instead of throwing
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalBranches: 0,
      totalRoles: 0,
    }
  }
}

/**
 * Get recent activity for dashboard
 * Shows the last 5 audit logs for the current user
 */
export async function getRecentActivity(limit: number = 5): Promise<RecentActivity[]> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    // Get recent audit logs for the current user
    const logs = await prisma.auditLog.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return logs.map(log => ({
      id: log.id,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      userName: log.user.profile?.fullName || log.user.email,
      createdAt: log.createdAt,
    }))
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}
