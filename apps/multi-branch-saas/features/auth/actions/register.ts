'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { RoleType, UserStatus } from '@/lib/generated/prisma'
import { registerSchema, type RegisterInput } from '@/lib/validation/auth.schema'
import { validatePasswordStrength } from '@/lib/utils/password'
import type { ActionResult } from '../types'

export async function register(data: RegisterInput): Promise<ActionResult> {
  // Validate input
  const validation = registerSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { email, password, fullName, phone, branchId } = validation.data

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password)
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: passwordValidation.error || 'Password does not meet security requirements',
    }
  }

  try {
    const supabase = await createClient()

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    })

    if (!branch) {
      return {
        success: false,
        error: 'Invalid branch selected',
      }
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Failed to create account',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user',
      }
    }

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
      },
    })

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName,
        phone: phone || null,
        branchId,
        status: UserStatus.ACTIVE,
      },
    })

    // Get default user role
    const userRole = await prisma.role.findUnique({
      where: { type: RoleType.USER },
    })

    if (userRole) {
      // Assign default role to user
      await prisma.userRole.create({
        data: {
          profileId: profile.id,
          roleId: userRole.id,
        },
      })
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Registration error:', error)

    // Check for unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: 'An account with this email already exists',
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }

  // Redirect to home after successful registration
  redirect('/')
}
