import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { checkRateLimit } from '@/lib/rate-limit'
import { getRateLimitConfig, getRateLimitIdentifier, getClientIP } from '@/lib/rate-limit/config'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // Get client IP for rate limiting
  const clientIP = getClientIP(request.headers)

  // Get current user ID for authenticated rate limiting
  let userId: string | null = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id || null
  } catch {
    // If we can't get user, continue with IP-based rate limiting
    userId = null
  }

  // Get rate limit configuration based on route
  const rateLimitConfig = getRateLimitConfig(request.nextUrl.pathname)

  // Get identifier for rate limiting (user ID or IP)
  const identifier = getRateLimitIdentifier(userId, clientIP)

  // Check rate limit
  const rateLimitResult = checkRateLimit(identifier, rateLimitConfig)

  // If rate limit exceeded, return 429 Too Many Requests
  if (!rateLimitResult.allowed) {
    const retryAfter = rateLimitResult.resetAt - Math.floor(Date.now() / 1000)

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    )
  }

  // Update Supabase session
  const response = await updateSession(request)

  // Add rate limit headers to response
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetAt.toString())

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
