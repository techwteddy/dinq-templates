import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export type CurrentUser = {
  id: string
  email: string
  profile: {
    id: string
    fullName: string
    phone: string | null
    avatar: string | null
    status: string
    branchId: string
    branch: {
      id: string
      name: string
      code: string
      type: string
    }
    userRoles: {
      id: string
      role: {
        id: string
        name: string
        type: string
        level: number
      }
    }[]
  }
} | null

/**
 * Get the current authenticated user with profile and roles
 * Returns null if user is not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Get user with profile and roles
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
              },
            },
            userRoles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!dbUser || !dbUser.profile) {
      return null
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      profile: dbUser.profile,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current user's highest role (lowest level number)
 */
export async function getCurrentUserRole() {
  const user = await getCurrentUser()

  if (!user || !user.profile.userRoles.length) {
    return null
  }

  // Get role with lowest level (highest permission)
  const highestRole = user.profile.userRoles.reduce((prev, current) => {
    return prev.role.level < current.role.level ? prev : current
  })

  return highestRole.role
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(roleType: string): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return user.profile.userRoles.some(ur => ur.role.type === roleType)
}

/**
 * Check if current user's role level is equal or higher (lower number) than specified level
 */
export async function hasRoleLevel(level: number): Promise<boolean> {
  const role = await getCurrentUserRole()

  if (!role) {
    return false
  }

  return role.level <= level
}
