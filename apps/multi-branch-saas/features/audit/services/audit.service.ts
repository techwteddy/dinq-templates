import { AuditAction } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/features/auth/utils/get-current-user'
import { headers } from 'next/headers'

/**
 * Audit log entry data
 */
export interface CreateAuditLogInput {
  action: AuditAction
  resource: string
  resourceId: string
  changes?: {
    before?: any
    after?: any
  }
}

/**
 * Get client IP address from request headers
 */
async function getClientIp(): Promise<string | null> {
  try {
    const headersList = await headers()

    // Try various headers that might contain the real IP
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim()
    }

    const realIp = headersList.get('x-real-ip')
    if (realIp) {
      return realIp
    }

    return null
  } catch (error) {
    console.error('Error getting client IP:', error)
    return null
  }
}

/**
 * Get user agent from request headers
 */
async function getUserAgent(): Promise<string | null> {
  try {
    const headersList = await headers()
    return headersList.get('user-agent')
  } catch (error) {
    console.error('Error getting user agent:', error)
    return null
  }
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<void> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      console.warn('Cannot create audit log: No authenticated user')
      return
    }

    const ipAddress = await getClientIp()
    const userAgent = await getUserAgent()

    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        changes: input.changes ?? undefined,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Log error but don't throw - we don't want audit logging to break the app
    console.error('Error creating audit log:', error)
  }
}

/**
 * Helper function to log CREATE operations
 */
export async function logCreate(resource: string, resourceId: string, data: any): Promise<void> {
  await createAuditLog({
    action: AuditAction.CREATE,
    resource,
    resourceId,
    changes: {
      after: data,
    },
  })
}

/**
 * Helper function to log UPDATE operations
 */
export async function logUpdate(
  resource: string,
  resourceId: string,
  before: any,
  after: any
): Promise<void> {
  await createAuditLog({
    action: AuditAction.UPDATE,
    resource,
    resourceId,
    changes: {
      before,
      after,
    },
  })
}

/**
 * Helper function to log DELETE operations
 */
export async function logDelete(resource: string, resourceId: string, data: any): Promise<void> {
  await createAuditLog({
    action: AuditAction.DELETE,
    resource,
    resourceId,
    changes: {
      before: data,
    },
  })
}

/**
 * Helper function to log LOGIN operations
 */
export async function logLogin(userId: string): Promise<void> {
  try {
    const ipAddress = await getClientIp()
    const userAgent = await getUserAgent()

    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.LOGIN,
        resource: 'auth',
        resourceId: userId,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Error logging login:', error)
  }
}

/**
 * Helper function to log LOGOUT operations
 */
export async function logLogout(userId: string): Promise<void> {
  try {
    const ipAddress = await getClientIp()
    const userAgent = await getUserAgent()

    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.LOGOUT,
        resource: 'auth',
        resourceId: userId,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Error logging logout:', error)
  }
}
