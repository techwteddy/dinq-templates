/**
 * Prisma Helper Functions
 *
 * Utilities for handling audit trail and soft delete functionality
 */

import { prisma } from '@/lib/prisma'

/**
 * Add deletedAt: null filter to a where clause to exclude soft-deleted records
 *
 * @example
 * const users = await prisma.user.findMany({
 *   where: withoutDeleted({ email: { contains: 'test' } })
 * })
 */
export function withoutDeleted<T extends Record<string, any>>(
  where: T = {} as T
): T & { deletedAt: null } {
  return {
    ...where,
    deletedAt: null,
  }
}

/**
 * Soft delete a record by setting deletedAt and deletedBy
 *
 * @param model - Prisma model (e.g., prisma.user, prisma.branch)
 * @param id - Record ID to soft delete
 * @param userId - ID of user performing the deletion
 *
 * @example
 * await softDelete(prisma.user, userId, currentUser.profile.id)
 */
export async function softDelete(model: any, id: string, deletedByProfileId: string): Promise<any> {
  return model.update({
    where: { id },
    data: {
      deletedBy: deletedByProfileId,
      deletedAt: new Date(),
    },
  })
}

/**
 * Create audit data for a new record
 *
 * @param profileId - ID of the profile creating the record (optional)
 * @returns Object with createdBy set
 *
 * @example
 * await prisma.user.create({
 *   data: {
 *     ...userData,
 *     ...createAuditData(currentUser?.profile.id)
 *   }
 * })
 */
export function createAuditData(profileId?: string) {
  return {
    createdBy: profileId,
  }
}

/**
 * Update audit data for an existing record
 *
 * @param profileId - ID of the profile updating the record (optional)
 * @returns Object with updatedBy set
 *
 * @example
 * await prisma.user.update({
 *   where: { id },
 *   data: {
 *     ...updateData,
 *     ...updateAuditData(currentUser?.profile.id)
 *   }
 * })
 */
export function updateAuditData(profileId?: string) {
  return {
    updatedBy: profileId,
  }
}

/**
 * Restore a soft-deleted record
 *
 * @param model - Prisma model
 * @param id - Record ID to restore
 * @param restoredByProfileId - ID of user performing the restore
 */
export async function restoreSoftDeleted(
  model: any,
  id: string,
  restoredByProfileId: string
): Promise<any> {
  return model.update({
    where: { id },
    data: {
      deletedBy: null,
      deletedAt: null,
      updatedBy: restoredByProfileId,
    },
  })
}

/**
 * Check if a record is soft-deleted
 *
 * @param record - Any record with deletedAt field
 * @returns true if record is soft-deleted
 */
export function isSoftDeleted(record: { deletedAt: Date | null }): boolean {
  return record.deletedAt !== null
}

/**
 * Get all soft-deleted records for a model
 *
 * @param model - Prisma model
 * @returns Array of soft-deleted records
 */
export async function getSoftDeleted(model: any): Promise<any[]> {
  return model.findMany({
    where: {
      deletedAt: {
        not: null,
      },
    },
  })
}
