import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withoutDeleted, createAuditData, updateAuditData, deleteAuditData } from './prisma-helpers'

describe('Prisma Helpers', () => {
  describe('withoutDeleted', () => {
    it('should add deletedAt null filter to empty where clause', () => {
      const result = withoutDeleted({})
      expect(result).toEqual({ deletedAt: null })
    })

    it('should preserve existing where conditions', () => {
      const where = { name: 'test', active: true }
      const result = withoutDeleted(where)
      expect(result).toEqual({
        name: 'test',
        active: true,
        deletedAt: null,
      })
    })

    it('should merge with existing AND conditions', () => {
      const where = { AND: [{ name: 'test' }, { active: true }] }
      const result = withoutDeleted(where)
      expect(result).toEqual({
        AND: [{ name: 'test' }, { active: true }, { deletedAt: null }],
      })
    })
  })

  describe('createAuditData', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should create audit data with profileId', () => {
      const profileId = 'test-profile-id'
      const result = createAuditData(profileId)

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('createdBy', profileId)
      expect(result).toHaveProperty('updatedAt')
      expect(result).toHaveProperty('updatedBy', profileId)
      expect(result.deletedAt).toBeNull()
      expect(result.deletedBy).toBeNull()
    })

    it('should handle undefined profileId', () => {
      const result = createAuditData(undefined)

      expect(result.createdBy).toBeNull()
      expect(result.updatedBy).toBeNull()
    })
  })

  describe('updateAuditData', () => {
    it('should create update audit data with profileId', () => {
      const profileId = 'test-profile-id'
      const result = updateAuditData(profileId)

      expect(result).toHaveProperty('updatedAt')
      expect(result).toHaveProperty('updatedBy', profileId)
      expect(result).not.toHaveProperty('createdAt')
      expect(result).not.toHaveProperty('createdBy')
    })

    it('should handle undefined profileId', () => {
      const result = updateAuditData(undefined)

      expect(result.updatedBy).toBeNull()
    })
  })

  describe('deleteAuditData', () => {
    it('should create delete audit data with profileId', () => {
      const profileId = 'test-profile-id'
      const result = deleteAuditData(profileId)

      expect(result).toHaveProperty('deletedAt')
      expect(result).toHaveProperty('deletedBy', profileId)
      expect(result).not.toHaveProperty('createdAt')
      expect(result).not.toHaveProperty('updatedAt')
    })

    it('should handle undefined profileId', () => {
      const result = deleteAuditData(undefined)

      expect(result.deletedBy).toBeNull()
    })
  })
})
