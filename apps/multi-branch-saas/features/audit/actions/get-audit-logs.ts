'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import type { AuditLogFilters, PaginatedAuditLogs } from '../types'

/**
 * Get paginated audit logs (admin only)
 */
export async function getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedAuditLogs> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      throw new Error('Unauthorized: You must be logged in')
    }

    // Check if user is admin (Super Admin, Regional Manager, or Admin Staff)
    const adminRoles = [RoleType.SUPER_ADMIN, RoleType.REGIONAL_MANAGER, RoleType.ADMIN_STAFF]
    const isAdmin = currentUser.profile.userRoles.some(ur =>
      (adminRoles as string[]).includes(ur.role.type)
    )

    if (!isAdmin) {
      throw new Error('Unauthorized: Only administrators can view audit logs')
    }

    const { userId, resource, action, dateFrom, dateTo, search, page = 1, limit = 20 } = filters

    // Build where clause
    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (resource) {
      where.resource = resource
    }

    if (action) {
      where.action = action
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}

      if (dateFrom) {
        where.createdAt.gte = dateFrom
      }

      if (dateTo) {
        where.createdAt.lte = dateTo
      }
    }

    if (search) {
      where.OR = [
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            profile: {
              fullName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          resource: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          resourceId: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Get total count
    const total = await prisma.auditLog.count({ where })

    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    // Get paginated data
    const logs = await prisma.auditLog.findMany({
      where,
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
      skip,
      take: limit,
    })

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages,
    }
  } catch (error) {
    console.error('Error getting audit logs:', error)
    throw error
  }
}
