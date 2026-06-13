import { z } from 'zod'
import { UserStatus, RoleType } from '@/lib/generated/prisma'

// Create user schema
export const createUserSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  branchId: z.string().min(1, 'Branch is required'),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
  status: z.nativeEnum(UserStatus).optional().default(UserStatus.ACTIVE),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// Update user schema
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  branchId: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required').optional(),
  status: z.nativeEnum(UserStatus).optional(),
  avatar: z.string().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

// User filters schema
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  branchId: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  roleType: z.nativeEnum(RoleType).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
})

export type UserFiltersInput = z.infer<typeof userFiltersSchema>

// Get user by ID schema
export const getUserByIdSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

// Delete user schema
export const deleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type DeleteUserInput = z.infer<typeof deleteUserSchema>

// Update user password schema
export const updateUserPasswordSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newPassword: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>
