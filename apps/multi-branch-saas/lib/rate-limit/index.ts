/**
 * Rate Limiting System
 *
 * Implements token bucket algorithm for rate limiting
 * Uses in-memory Map for simplicity (no Redis required)
 *
 * For production with multiple servers, consider:
 * - Upstash Redis (serverless-friendly)
 * - Vercel KV
 * - Redis Cloud
 */

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Optional: Skip rate limiting in development
   */
  skipInDevelopment?: boolean
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean

  /**
   * Remaining requests in current window
   */
  remaining: number

  /**
   * Timestamp when the window resets (Unix timestamp in seconds)
   */
  resetAt: number

  /**
   * Total limit
   */
  limit: number
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (Map with automatic cleanup)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000
setInterval(() => {
  const now = Math.floor(Date.now() / 1000)
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, CLEANUP_INTERVAL)

/**
 * Check rate limit for a given identifier
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  // Skip in development if configured
  if (config.skipInDevelopment && process.env.NODE_ENV === 'development') {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: Math.floor(Date.now() / 1000) + config.windowSeconds,
      limit: config.maxRequests,
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const entry = rateLimitStore.get(identifier)

  // No entry or window expired - create new entry
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowSeconds

    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
      limit: config.maxRequests,
    }
  }

  // Entry exists and window is active
  if (entry.count < config.maxRequests) {
    // Allow request and increment count
    entry.count++

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
      limit: config.maxRequests,
    }
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: entry.resetAt,
    limit: config.maxRequests,
  }
}

/**
 * Reset rate limit for a given identifier
 * Useful for testing or manual overrides
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Math.floor(Date.now() / 1000)
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetAt < now) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowSeconds,
      limit: config.maxRequests,
    }
  }

  return {
    allowed: entry.count < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
    limit: config.maxRequests,
  }
}

/**
 * Clear all rate limit entries
 * Useful for testing
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Get total number of tracked identifiers
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size
}
