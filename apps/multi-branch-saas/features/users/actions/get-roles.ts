'use server'

import { prisma } from '@/lib/prisma'

export async function getRolesAction() {
  try {
    const roles = await prisma.role.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        level: true,
      },
      orderBy: {
        level: 'asc',
      },
    })

    return roles
  } catch (error) {
    console.error('Error fetching roles:', error)
    return []
  }
}
