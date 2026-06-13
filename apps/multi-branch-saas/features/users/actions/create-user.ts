'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createUserSchema } from '@/lib/validation/user.schema'
import { createUser } from '../services'
import { checkPermission, canAccessBranch } from '@/lib/rbac'
import { getCurrentUser } from '@/features/auth/utils'
import { PermissionScope } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { validatePasswordStrength } from '@/lib/utils/password'
import { logCreate } from '@/features/audit/services'
import type { ActionResult } from '@/features/auth/types'

export async function createUserAction(data: any): Promise<ActionResult> {
  try {
    // Check permission
    const hasPermission = await checkPermission('users', 'create', PermissionScope.BRANCH)

    if (!hasPermission) {
      return {
        success: false,
        error: 'Unauthorized: You do not have permission to create users',
      }
    }

    // Validate input
    const validation = createUserSchema.safeParse(data)

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const { email, password, fullName, phone, branchId, roleIds, status } = validation.data

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.error || 'Password does not meet security requirements',
      }
    }

    // Check if branch exists and is accessible BEFORE creating auth user
    const hasAccessToBranch = await canAccessBranch(branchId)

    if (!hasAccessToBranch) {
      return {
        success: false,
        error: 'Branch not accessible: You can only create users in branches you have access to',
      }
    }

    // Check if email already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists',
      }
    }

    // Validate that all roles exist
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    })

    if (roles.length !== roleIds.length) {
      return {
        success: false,
        error: 'One or more invalid role IDs',
      }
    }

    // Check if user can assign these roles (role level validation)
    const currentUser = await getCurrentUser()

    if (currentUser) {
      // Get current user's highest role (lowest level number)
      const currentUserHighestRole = currentUser.profile.userRoles.reduce((prev, current) => {
        return prev.role.level < current.role.level ? prev : current
      })

      // Check if trying to assign any role with equal or higher level
      const invalidRoles = roles.filter(role => role.level <= currentUserHighestRole.role.level)

      if (invalidRoles.length > 0) {
        return {
          success: false,
          error: `You cannot assign roles of equal or higher level than your own. Invalid roles: ${invalidRoles.map(r => r.name).join(', ')}`,
        }
      }
    }

    // Create user in Supabase Auth using admin client
    const supabase = createAdminClient()

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Failed to create user in authentication system',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user',
      }
    }

    // Create user in database with error handling and cleanup
    try {
      await createUser(
        {
          email,
          password,
          fullName,
          phone,
          branchId,
          roleIds,
          status,
        },
        authData.user.id
      )

      // Log the create operation
      await logCreate('users', authData.user.id, {
        email,
        fullName,
        phone,
        branchId,
        roleIds,
        status,
      })
    } catch (dbError) {
      // If database creation fails, cleanup the Supabase Auth user
      console.error('Database creation failed, cleaning up auth user:', dbError)

      await supabase.auth.admin.deleteUser(authData.user.id)

      if (dbError instanceof Error) {
        return {
          success: false,
          error: dbError.message,
        }
      }

      return {
        success: false,
        error: 'Failed to create user in database',
      }
    }

    revalidatePath('/users')

    return {
      success: true,
      message: 'User created successfully',
    }
  } catch (error) {
    console.error('Error in createUserAction:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
