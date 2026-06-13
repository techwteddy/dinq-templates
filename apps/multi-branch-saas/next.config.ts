import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Content Security Policy (CSP)
          // Protects against XSS, clickjacking, and other code injection attacks
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only allow resources from same origin
              "default-src 'self'",
              // Scripts: allow self, Supabase, and inline scripts (needed for Next.js)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co",
              // Styles: allow self and inline styles (needed for styled components)
              "style-src 'self' 'unsafe-inline'",
              // Images: allow self, Supabase Storage, data URIs, and blob URIs
              "img-src 'self' https://*.supabase.co data: blob:",
              // Fonts: allow self and data URIs
              "font-src 'self' data:",
              // Connect: allow self and Supabase (for API calls and WebSockets)
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              // Media: allow self and Supabase
              "media-src 'self' https://*.supabase.co",
              // Objects: disallow (Flash, Java, etc.)
              "object-src 'none'",
              // Base URI: only allow same origin
              "base-uri 'self'",
              // Form actions: only allow same origin
              "form-action 'self'",
              // Frame ancestors: disallow embedding (prevents clickjacking)
              "frame-ancestors 'none'",
              // Upgrade insecure requests in production
              process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests' : '',
            ]
              .filter(Boolean)
              .join('; '),
          },
          // X-Frame-Options: Prevents clickjacking by disallowing iframe embedding
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options: Prevents MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-XSS-Protection: Enables browser XSS filter (legacy, but doesn't hurt)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer-Policy: Controls referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy: Controls which browser features can be used
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
            ].join(', '),
          },
          // Strict-Transport-Security: Forces HTTPS (only in production)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ]
  },
}

export default nextConfig
