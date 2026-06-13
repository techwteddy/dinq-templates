import { describe, it, expect } from 'vitest'
import { createBranchSchema, updateBranchSchema } from './branch.schema'

describe('Branch Schema Validation', () => {
  describe('createBranchSchema', () => {
    it('should validate correct branch data', () => {
      const validData = {
        name: 'Main Branch',
        code: 'MB-001',
        type: 'HQ',
        address: '123 Main St',
        phone: '+1234567890',
        parentId: null,
      }

      const result = createBranchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        code: 'MB-001',
        type: 'HQ',
      }

      const result = createBranchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty code', () => {
      const invalidData = {
        name: 'Main Branch',
        code: '',
        type: 'HQ',
      }

      const result = createBranchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept optional fields as undefined', () => {
      const validData = {
        name: 'Main Branch',
        code: 'MB-001',
        type: 'HQ',
      }

      const result = createBranchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('updateBranchSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        name: 'Updated Branch Name',
      }

      const result = updateBranchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept multiple optional fields', () => {
      const validData = {
        name: 'New Name',
        address: 'New Address',
        phone: '+9876543210',
      }

      const result = updateBranchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty name in update', () => {
      const invalidData = {
        name: '',
      }

      const result = updateBranchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
