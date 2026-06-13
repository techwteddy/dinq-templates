import { NotificationType } from '@/lib/generated/prisma'
import { createNotification, createBulkNotifications } from './notification.service'
import type { CreateNotificationInput, BulkNotificationInput } from '../types'

/**
 * Send notification when a user is created
 */
export async function notifyUserCreated(params: {
  userId: string
  profileId: string
  userName: string
  createdBy: string
}) {
  try {
    await createNotification({
      profileId: params.profileId,
      type: NotificationType.USER_CREATED,
      title: 'Welcome to RepairShop!',
      message: `Your account has been created successfully. You can now start using the system.`,
      link: `/users/${params.userId}`,
      metadata: {
        userId: params.userId,
        createdBy: params.createdBy,
      },
    })
  } catch (error) {
    console.error('Error sending user created notification:', error)
  }
}

/**
 * Send notification when a user is updated
 */
export async function notifyUserUpdated(params: {
  userId: string
  profileId: string
  userName: string
  changes: string[]
}) {
  try {
    await createNotification({
      profileId: params.profileId,
      type: NotificationType.USER_UPDATED,
      title: 'Profile Updated',
      message: `Your profile has been updated: ${params.changes.join(', ')}`,
      link: `/users/${params.userId}`,
      metadata: {
        userId: params.userId,
        changes: params.changes,
      },
    })
  } catch (error) {
    console.error('Error sending user updated notification:', error)
  }
}

/**
 * Send notification when a user is deleted
 */
export async function notifyUserDeleted(params: {
  userId: string
  profileId: string
  userName: string
}) {
  try {
    await createNotification({
      profileId: params.profileId,
      type: NotificationType.USER_DELETED,
      title: 'Account Deactivated',
      message:
        'Your account has been deactivated. Please contact your administrator for more information.',
      metadata: {
        userId: params.userId,
      },
    })
  } catch (error) {
    console.error('Error sending user deleted notification:', error)
  }
}

/**
 * Send notification when a branch is created
 */
export async function notifyBranchCreated(params: {
  branchId: string
  branchName: string
  profileIds: string[]
}) {
  try {
    await createBulkNotifications({
      profileIds: params.profileIds,
      type: NotificationType.BRANCH_CREATED,
      title: 'New Branch Created',
      message: `A new branch "${params.branchName}" has been created.`,
      link: `/branches`,
      metadata: {
        branchId: params.branchId,
        branchName: params.branchName,
      },
    })
  } catch (error) {
    console.error('Error sending branch created notification:', error)
  }
}

/**
 * Send notification when a branch is updated
 */
export async function notifyBranchUpdated(params: {
  branchId: string
  branchName: string
  profileIds: string[]
  changes: string[]
}) {
  try {
    await createBulkNotifications({
      profileIds: params.profileIds,
      type: NotificationType.BRANCH_UPDATED,
      title: 'Branch Updated',
      message: `Branch "${params.branchName}" has been updated: ${params.changes.join(', ')}`,
      link: `/branches`,
      metadata: {
        branchId: params.branchId,
        branchName: params.branchName,
        changes: params.changes,
      },
    })
  } catch (error) {
    console.error('Error sending branch updated notification:', error)
  }
}

/**
 * Send notification when a branch is deleted
 */
export async function notifyBranchDeleted(params: {
  branchId: string
  branchName: string
  profileIds: string[]
}) {
  try {
    await createBulkNotifications({
      profileIds: params.profileIds,
      type: NotificationType.BRANCH_DELETED,
      title: 'Branch Deleted',
      message: `Branch "${params.branchName}" has been deleted.`,
      metadata: {
        branchId: params.branchId,
        branchName: params.branchName,
      },
    })
  } catch (error) {
    console.error('Error sending branch deleted notification:', error)
  }
}

/**
 * Send notification when a role is assigned
 */
export async function notifyRoleAssigned(params: {
  userId: string
  profileId: string
  roleName: string
  roleType: string
}) {
  try {
    await createNotification({
      profileId: params.profileId,
      type: NotificationType.ROLE_ASSIGNED,
      title: 'Role Assigned',
      message: `You have been assigned the role "${params.roleName}".`,
      link: `/users/${params.userId}`,
      metadata: {
        userId: params.userId,
        roleName: params.roleName,
        roleType: params.roleType,
      },
    })
  } catch (error) {
    console.error('Error sending role assigned notification:', error)
  }
}

/**
 * Send notification when a role is removed
 */
export async function notifyRoleRemoved(params: {
  userId: string
  profileId: string
  roleName: string
  roleType: string
}) {
  try {
    await createNotification({
      profileId: params.profileId,
      type: NotificationType.ROLE_REMOVED,
      title: 'Role Removed',
      message: `The role "${params.roleName}" has been removed from your account.`,
      link: `/users/${params.userId}`,
      metadata: {
        userId: params.userId,
        roleName: params.roleName,
        roleType: params.roleType,
      },
    })
  } catch (error) {
    console.error('Error sending role removed notification:', error)
  }
}

/**
 * Send notification when permissions change
 */
export async function notifyPermissionChanged(params: {
  profileIds: string[]
  resourceType: string
  action: string
}) {
  try {
    await createBulkNotifications({
      profileIds: params.profileIds,
      type: NotificationType.PERMISSION_CHANGED,
      title: 'Permissions Updated',
      message: `Your ${params.resourceType} ${params.action} permissions have been updated.`,
      metadata: {
        resourceType: params.resourceType,
        action: params.action,
      },
    })
  } catch (error) {
    console.error('Error sending permission changed notification:', error)
  }
}

/**
 * Send system announcement to all users
 */
export async function notifySystemAnnouncement(params: {
  profileIds: string[]
  title: string
  message: string
  link?: string
}) {
  try {
    await createBulkNotifications({
      profileIds: params.profileIds,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: params.title,
      message: params.message,
      link: params.link,
    })
  } catch (error) {
    console.error('Error sending system announcement:', error)
  }
}

/**
 * Send custom notification
 */
export async function notifyCustom(params: CreateNotificationInput) {
  try {
    await createNotification({
      ...params,
      type: NotificationType.CUSTOM,
    })
  } catch (error) {
    console.error('Error sending custom notification:', error)
  }
}
