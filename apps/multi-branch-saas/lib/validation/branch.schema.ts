import { z } from 'zod'
import { BranchType } from '@/lib/generated/prisma'

// Create branch schema
export const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Branch name must not exceed 100 characters'),
  code: z
    .string()
    .min(1, 'Branch code is required')
    .min(2, 'Branch code must be at least 2 characters')
    .max(20, 'Branch code must not exceed 20 characters')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Branch code must contain only uppercase letters, numbers, hyphens, and underscores'
    ),
  type: z.nativeEnum(BranchType, {
    message: 'Invalid branch type',
  }),
  parentId: z.string().optional(),
  address: z.string().max(500, 'Address must not exceed 500 characters').optional(),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  email: z.string().email('Invalid email address').optional(),
  isActive: z.boolean().optional().default(true),
})

export type CreateBranchInput = z.infer<typeof createBranchSchema>

// Update branch schema
export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Branch name must not exceed 100 characters')
    .optional(),
  code: z
    .string()
    .min(2, 'Branch code must be at least 2 characters')
    .max(20, 'Branch code must not exceed 20 characters')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Branch code must contain only uppercase letters, numbers, hyphens, and underscores'
    )
    .optional(),
  type: z
    .nativeEnum(BranchType, {
      message: 'Invalid branch type',
    })
    .optional(),
  parentId: z.string().nullable().optional(),
  address: z.string().max(500, 'Address must not exceed 500 characters').optional(),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  email: z.string().email('Invalid email address').optional(),
  isActive: z.boolean().optional(),
})

export type UpdateBranchInput = z.infer<typeof updateBranchSchema>

// Branch filters schema
export const branchFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(BranchType).optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
})

export type BranchFiltersInput = z.infer<typeof branchFiltersSchema>

// Get branch by ID schema
export const getBranchByIdSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
})

export type GetBranchByIdInput = z.infer<typeof getBranchByIdSchema>

// Delete branch schema
export const deleteBranchSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
})

export type DeleteBranchInput = z.infer<typeof deleteBranchSchema>
