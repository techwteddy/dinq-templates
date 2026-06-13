import type { RateLimitConfig } from './index'

/**
 * Rate limit configurations for different routes/actions
 *
 * Adjust these values based on your needs:
 * - Higher limits for authenticated users
 * - Lower limits for authentication endpoints
 * - Very low limits for sensitive actions
 */

/**
 * Default rate limit for general API requests
 * 100 requests per minute
 */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowSeconds: 60,
  skipInDevelopment: true,
}

/**
 * Strict rate limit for authentication endpoints
 * Prevents brute force attacks
 * 5 attempts per minute
 */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60,
  skipInDevelopment: false, // Always enforce for security
}

/**
 * Rate limit for sensitive actions (password reset, email change)
 * 3 attempts per 5 minutes
 */
export const SENSITIVE_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 3,
  windowSeconds: 300,
  skipInDevelopment: false,
}

/**
 * Rate limit for file uploads
 * 10 uploads per hour
 */
export const UPLOAD_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowSeconds: 3600,
  skipInDevelopment: true,
}

/**
 * Rate limit for API routes (server actions)
 * 60 requests per minute per user
 */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowSeconds: 60,
  skipInDevelopment: true,
}

/**
 * Rate limit for public pages (no auth required)
 * 200 requests per minute per IP
 */
export const PUBLIC_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 200,
  windowSeconds: 60,
  skipInDevelopment: true,
}

/**
 * Get rate limit configuration based on request path
 *
 * @param pathname - Request pathname
 * @returns Appropriate rate limit configuration
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Authentication routes - strict limits
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return AUTH_RATE_LIMIT
  }

  // API routes - moderate limits
  if (pathname.startsWith('/api/')) {
    return API_RATE_LIMIT
  }

  // Upload endpoints - hourly limits
  if (pathname.includes('/upload')) {
    return UPLOAD_RATE_LIMIT
  }

  // Public pages - generous limits
  if (pathname === '/' || pathname.startsWith('/public')) {
    return PUBLIC_RATE_LIMIT
  }

  // Default for all other routes
  return DEFAULT_RATE_LIMIT
}

/**
 * Get identifier for rate limiting
 *
 * Priority:
 * 1. User ID (for authenticated users)
 * 2. IP address (for anonymous users)
 *
 * @param userId - Optional user ID
 * @param ip - IP address
 * @returns Unique identifier for rate limiting
 */
export function getRateLimitIdentifier(userId: string | null, ip: string): string {
  if (userId) {
    return `user:${userId}`
  }
  return `ip:${ip}`
}

/**
 * Get client IP address from request headers
 *
 * Checks multiple headers in order of reliability:
 * 1. x-forwarded-for (most common with proxies)
 * 2. x-real-ip (some proxies)
 * 3. cf-connecting-ip (Cloudflare)
 * 4. x-vercel-forwarded-for (Vercel)
 */
export function getClientIP(headers: Headers): string {
  // Check x-forwarded-for (comma-separated list, take first)
  const xForwardedFor = headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  // Check x-real-ip
  const xRealIp = headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp
  }

  // Check Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Check Vercel
  const vercelForwardedFor = headers.get('x-vercel-forwarded-for')
  if (vercelForwardedFor) {
    return vercelForwardedFor
  }

  // Fallback to unknown
  return 'unknown'
}
