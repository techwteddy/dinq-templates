/**
 * Branch hierarchy configuration
 */

export const BRANCH_CONFIG = {
  /**
   * Maximum depth for branch hierarchy
   * 0 = unlimited (not recommended)
   * Default: 5 levels (HQ → Region → Branch → Sub-Branch → Team)
   */
  MAX_DEPTH: parseInt(process.env.MAX_BRANCH_DEPTH || '5', 10),
} as const
