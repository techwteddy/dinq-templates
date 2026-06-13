import { describe, it, expect } from 'vitest'
import { createUserSchema, updateUserSchema } from './user.schema'

describe('User Schema Validation', () => {
  describe('createUserSchema', () => {
    it('should validate correct user data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        fullName: 'John Doe',
        phone: '+1234567890',
        branchId: 'branch-123',
        roleIds: ['role-1', 'role-2'],
        status: 'ACTIVE',
      }

      const result = createUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'StrongPassword123!',
        fullName: 'John Doe',
        branchId: 'branch-123',
        roleIds: ['role-1'],
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        fullName: 'John Doe',
        branchId: 'branch-123',
        roleIds: ['role-1'],
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty fullName', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        fullName: '',
        branchId: 'branch-123',
        roleIds: ['role-1'],
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty roleIds array', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        fullName: 'John Doe',
        branchId: 'branch-123',
        roleIds: [],
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('updateUserSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        email: 'newemail@example.com',
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept multiple optional fields', () => {
      const validData = {
        fullName: 'Jane Doe',
        phone: '+9876543210',
        status: 'INACTIVE',
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email in update', () => {
      const invalidData = {
        email: 'not-an-email',
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
