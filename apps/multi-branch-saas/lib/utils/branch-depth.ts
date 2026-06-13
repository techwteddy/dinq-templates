import { prisma } from '@/lib/prisma'
import { BRANCH_CONFIG } from '@/lib/config/branch'

/**
 * Calculate the depth of a branch in the hierarchy
 * Depth is calculated as the number of ancestors
 * - Root branch (no parent): depth = 0
 * - Direct child of root: depth = 1
 * - etc.
 *
 * @param branchId - ID of the branch to calculate depth for
 * @returns Promise<number> - The depth of the branch
 */
export async function calculateBranchDepth(branchId: string): Promise<number> {
  let depth = 0
  let currentBranchId: string | null = branchId

  // Traverse up the hierarchy counting ancestors
  while (currentBranchId) {
    const branch: { parentId: string | null } | null = await prisma.branch.findUnique({
      where: { id: currentBranchId },
      select: { parentId: true },
    })

    if (!branch || !branch.parentId) {
      break
    }

    depth++
    currentBranchId = branch.parentId
  }

  return depth
}

/**
 * Calculate the depth a new branch would have if created with given parentId
 *
 * @param parentId - ID of the parent branch (null for root branch)
 * @returns Promise<number> - The depth the new branch would have
 */
export async function calculateNewBranchDepth(parentId: string | null): Promise<number> {
  if (!parentId) {
    return 0 // Root branch
  }

  const parentDepth = await calculateBranchDepth(parentId)
  return parentDepth + 1
}

/**
 * Validate if a branch can be created/updated with the given parent
 * based on MAX_BRANCH_DEPTH configuration
 *
 * @param parentId - ID of the parent branch (null for root branch)
 * @returns Promise<{ valid: boolean; depth: number; maxDepth: number; message?: string }>
 */
export async function validateBranchDepth(parentId: string | null): Promise<{
  valid: boolean
  depth: number
  maxDepth: number
  message?: string
}> {
  const maxDepth = BRANCH_CONFIG.MAX_DEPTH
  const newDepth = await calculateNewBranchDepth(parentId)

  // 0 = unlimited depth
  if (maxDepth === 0) {
    return {
      valid: true,
      depth: newDepth,
      maxDepth: 0,
    }
  }

  const valid = newDepth < maxDepth

  return {
    valid,
    depth: newDepth,
    maxDepth,
    message: valid
      ? undefined
      : `Maximum branch depth exceeded. Cannot create branch at depth ${newDepth} (max: ${maxDepth - 1})`,
  }
}

/**
 * Get the maximum depth allowed for branches
 * @returns number - Maximum depth (0 = unlimited)
 */
export function getMaxBranchDepth(): number {
  return BRANCH_CONFIG.MAX_DEPTH
}
