# 🔒 Security Documentation

This document outlines the security measures implemented in the Branch Management Boilerplate.

## 📋 Table of Contents

- [Security Headers](#security-headers)
- [Content Security Policy](#content-security-policy)
- [Authentication Security](#authentication-security)
- [Database Security](#database-security)
- [File Upload Security](#file-upload-security)
- [RBAC Security](#rbac-security)
- [Testing Security](#testing-security)
- [Security Checklist](#security-checklist)

---

## Security Headers

Security headers are HTTP response headers that instruct browsers to enable additional security protections.

### Implemented Headers

#### 1. Content-Security-Policy (CSP)

**Purpose:** Prevents XSS attacks, clickjacking, and other code injection attacks.

**Configuration:**

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co;
style-src 'self' 'unsafe-inline';
img-src 'self' https://*.supabase.co data: blob:;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
media-src 'self' https://*.supabase.co;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

**What it does:**

- **default-src 'self'**: By default, only allow resources from the same origin
- **script-src**: Allow scripts from same origin, Supabase, and inline scripts (needed for Next.js)
- **style-src**: Allow styles from same origin and inline styles (needed for CSS-in-JS)
- **img-src**: Allow images from same origin, Supabase Storage, data URIs, and blob URIs
- **connect-src**: Allow API calls to same origin and Supabase (includes WebSocket for real-time)
- **object-src 'none'**: Disallow Flash, Java applets, and other plugins
- **frame-ancestors 'none'**: Prevent page from being embedded in iframes (clickjacking protection)
- **upgrade-insecure-requests**: Automatically upgrade HTTP to HTTPS in production

**Why 'unsafe-inline' and 'unsafe-eval'?**

- Next.js requires 'unsafe-inline' for inline scripts and styles during development
- 'unsafe-eval' is needed for React DevTools and some Next.js features
- In production, consider using nonces or hashes for stricter CSP

**Customization:**

If you need to add additional domains (e.g., analytics, fonts), update `next.config.ts`:

```typescript
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://www.googletagmanager.com",
"connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com",
```

---

#### 2. X-Frame-Options

**Value:** `DENY`

**Purpose:** Prevents clickjacking by disallowing the page from being embedded in iframes.

**Options:**

- `DENY`: Never allow embedding
- `SAMEORIGIN`: Allow embedding from same origin only
- `ALLOW-FROM uri`: Allow embedding from specific URI (deprecated)

**Why DENY?**

- This application doesn't need to be embedded in iframes
- Provides strongest protection against clickjacking
- Works in conjunction with CSP `frame-ancestors 'none'`

---

#### 3. X-Content-Type-Options

**Value:** `nosniff`

**Purpose:** Prevents MIME type sniffing attacks.

**What it does:**

- Forces browser to respect the declared Content-Type
- Prevents browser from interpreting files as a different MIME type
- Blocks execution of scripts disguised as images or other file types

**Example Attack Prevented:**

```
// Attacker uploads "image.jpg" that's actually a JavaScript file
// Without this header: Browser might execute it as JS
// With this header: Browser treats it strictly as an image
```

---

#### 4. X-XSS-Protection

**Value:** `1; mode=block`

**Purpose:** Enables browser's XSS filter (legacy header, but doesn't hurt).

**Options:**

- `0`: Disable filter
- `1`: Enable filter (sanitize detected XSS)
- `1; mode=block`: Enable filter and block page if XSS detected

**Note:** Modern browsers use CSP instead, but this provides backward compatibility.

---

#### 5. Referrer-Policy

**Value:** `strict-origin-when-cross-origin`

**Purpose:** Controls how much referrer information is sent with requests.

**Behavior:**

- **Same origin**: Send full URL as referrer
- **Cross-origin HTTPS→HTTPS**: Send origin only (no path)
- **Cross-origin HTTPS→HTTP**: Send nothing (downgrade protection)

**Why this policy?**

- Balances privacy and functionality
- Prevents leaking sensitive information in URLs
- Allows same-origin navigation tracking

**Other Options:**

- `no-referrer`: Never send referrer (most private)
- `origin`: Always send origin only
- `no-referrer-when-downgrade`: Default browser behavior

---

#### 6. Permissions-Policy

**Value:** `camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()`

**Purpose:** Controls which browser features and APIs can be used.

**What it does:**

- **camera=()**: Disables camera access
- **microphone=()**: Disables microphone access
- **geolocation=()**: Disables geolocation API
- **interest-cohort=()**: Opts out of FLoC (privacy protection)
- **payment=()**: Disables Payment Request API

**Why disable these?**

- Application doesn't use these features
- Reduces attack surface
- Protects user privacy

**Enabling Features:**

If you need to enable a feature:

```typescript
'camera=(self)', // Allow camera on same origin
'geolocation=(self "https://maps.example.com")', // Allow specific domains
```

---

#### 7. Strict-Transport-Security (HSTS)

**Value:** `max-age=63072000; includeSubDomains; preload`

**Purpose:** Forces HTTPS connections for improved security.

**Configuration:**

- **max-age=63072000**: Remember for 2 years (730 days)
- **includeSubDomains**: Apply to all subdomains
- **preload**: Eligible for HSTS preload list

**What it does:**

- Browser remembers to only use HTTPS
- Prevents SSL stripping attacks
- Protects against man-in-the-middle attacks

**Note:** Only applied in production (when `NODE_ENV=production`)

**⚠️ Important:**

- Once enabled, you must support HTTPS for the duration of max-age
- Before enabling preload, read: https://hstspreload.org/

---

## Content Security Policy

### CSP Violation Reporting

To monitor CSP violations in production, add a report URI:

**1. Create reporting endpoint:**

```typescript
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json()

  console.error('CSP Violation:', report)

  // Send to error tracking service (Sentry, LogRocket, etc.)
  // await Sentry.captureMessage('CSP Violation', { extra: report })

  return new Response('Report received', { status: 204 })
}
```

**2. Update CSP in next.config.ts:**

```typescript
"report-uri /api/csp-report",
"report-to csp-endpoint",
```

### CSP Testing

**Development:**

```bash
# Start dev server
npm run dev

# Open browser console
# Look for CSP violations

# Example violation:
# Refused to load the script 'https://evil.com/script.js'
# because it violates the Content-Security-Policy directive
```

**Production:**

```bash
# Build and start
npm run build
npm start

# Test with curl
curl -I https://yourdomain.com

# Check for CSP header
```

---

## Authentication Security

### Password Security

**Requirements:**

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

**Implementation:** `lib/utils/password.ts`

**Hashing:**

- Uses bcrypt via Supabase Auth
- Automatic salt generation
- Configurable work factor

### Session Security

**Features:**

- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- Automatic session refresh
- Session expiry (default: 7 days)

**Implementation:** Supabase Auth handles session management

### Brute Force Protection

Protected by comprehensive rate limiting system (see Rate Limiting section below).

---

## Rate Limiting

Protects against abuse, brute force attacks, and DDoS attempts.

### Implementation

**Location:** `lib/rate-limit/` and `middleware.ts`

**Algorithm:** Token bucket (sliding window)

**Storage:** In-memory Map (suitable for single-server deployments)

**For Multi-Server:** Consider Upstash Redis or Vercel KV

### Rate Limit Configurations

| Route Type                                 | Limit        | Window   | Purpose               |
| ------------------------------------------ | ------------ | -------- | --------------------- |
| **Authentication** (`/login`, `/register`) | 5 requests   | 1 minute | Prevent brute force   |
| **API Routes** (`/api/*`)                  | 60 requests  | 1 minute | Moderate API usage    |
| **File Uploads** (`/upload`)               | 10 requests  | 1 hour   | Prevent storage abuse |
| **Public Pages** (`/`, `/public`)          | 200 requests | 1 minute | Generous for browsing |
| **Default** (other routes)                 | 100 requests | 1 minute | General protection    |

### Rate Limiting Strategy

**Identifier Priority:**

1. **User ID** (authenticated users) - More accurate tracking
2. **IP Address** (anonymous users) - Fallback for unauthenticated

**Headers Returned:**

```
X-RateLimit-Limit: 100          # Total requests allowed
X-RateLimit-Remaining: 42       # Remaining requests
X-RateLimit-Reset: 1704067200   # Unix timestamp when limit resets
Retry-After: 45                 # Seconds until retry (429 only)
```

### Response on Limit Exceeded

**Status Code:** `429 Too Many Requests`

**Response Body:**

```json
{
  "error": "Too Many Requests",
  "message": "You have exceeded the rate limit. Please try again later.",
  "retryAfter": 45
}
```

### Testing Rate Limits

**Manual Test:**

```bash
# Test authentication rate limit (5 requests/minute)
for i in {1..10}; do
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -i
done

# After 5 requests, you should see:
# HTTP/1.1 429 Too Many Requests
# X-RateLimit-Limit: 5
# X-RateLimit-Remaining: 0
# Retry-After: 45
```

### Configuration

**Adjust Limits:** Edit `lib/rate-limit/config.ts`

```typescript
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10, // Increase from 5 to 10
  windowSeconds: 60,
  skipInDevelopment: false,
}
```

**Skip in Development:**

```typescript
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowSeconds: 60,
  skipInDevelopment: true, // No rate limiting in dev
}
```

### Production Considerations

**For High Traffic:**

```typescript
// Option 1: Use Upstash Redis (Vercel-friendly)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// Option 2: Use Vercel KV
import { kv } from '@vercel/kv'
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})
```

**Whitelist IPs:**

```typescript
// In middleware.ts
const WHITELISTED_IPS = ['192.168.1.1', '10.0.0.1']

if (WHITELISTED_IPS.includes(clientIP)) {
  // Skip rate limiting for whitelisted IPs
  return await updateSession(request)
}
```

### Monitoring

**Track Rate Limit Hits:**

```typescript
// In middleware.ts, when rate limit exceeded:
if (!rateLimitResult.allowed) {
  // Log rate limit hit for monitoring
  console.warn('Rate limit exceeded:', {
    identifier,
    path: request.nextUrl.pathname,
    limit: rateLimitResult.limit,
  })

  // Send to monitoring service
  // await sendToSentry({ type: 'rate_limit_exceeded', identifier })
}
```

**Dashboard Metrics:**

Monitor in production:

- Total rate limit hits
- Most rate-limited IPs/users
- Most rate-limited endpoints

---

## Database Security

### Row-Level Security (RLS)

**What it is:**

- PostgreSQL security feature
- Enforces access control at database level
- Prevents unauthorized data access even if application code is bypassed

**Implementation:**

All tables have RLS policies based on:

- User authentication status
- User's branch hierarchy
- User's role and permissions

**Example Policy:**

```sql
-- Users can only read users in their accessible branches
CREATE POLICY "Users can read accessible branch users"
ON users FOR SELECT
USING (
  profile.branch_id IN (
    SELECT id FROM accessible_branches(auth.uid())
  )
);
```

### Soft Delete

**Pattern:**

- Records are never hard-deleted
- Instead, `deletedAt` and `deletedBy` fields are set
- Queries automatically filter deleted records

**Benefits:**

- Maintains audit trail
- Allows data recovery
- Prevents accidental data loss

**Implementation:** `lib/utils/prisma-helpers.ts`

```typescript
// Automatically excludes soft-deleted records
const users = await prisma.user.findMany({
  where: withoutDeleted({ isActive: true }),
})
```

### SQL Injection Protection

**How it's prevented:**

- Prisma ORM uses parameterized queries
- All user input is sanitized
- No raw SQL queries with user input

**Example:**

```typescript
// ✅ SAFE: Parameterized query
await prisma.user.findUnique({ where: { email: userInput } })

// ❌ UNSAFE: Raw SQL with user input (DON'T DO THIS)
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`
```

---

## File Upload Security

### Validation

**File Type:**

```typescript
// Avatars: JPEG, PNG, GIF, WebP only
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// Logos: JPEG, PNG, GIF, WebP, SVG
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
```

**File Size:**

- Maximum: 5MB per file
- Configurable in `lib/supabase/storage.ts`

**Implementation:** `lib/supabase/storage.ts`

### Storage Security

**Supabase Storage RLS Policies:**

```sql
-- Public read access
CREATE POLICY "Public can read files"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated upload only
CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Users can update/delete own files only
CREATE POLICY "Users manage own files"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Path Traversal Protection

**Prevention:**

- File paths are generated server-side
- User input is sanitized
- Files stored in user-specific folders: `{userId}/avatar.ext`

**Example:**

```typescript
// ✅ SAFE: Server-generated path
const filePath = `${userId}/avatar.${fileExt}`

// ❌ UNSAFE: User-provided path (DON'T DO THIS)
const filePath = userProvidedPath
```

---

## RBAC Security

### Permission Enforcement

**Layers:**

1. **Server Actions**: Check permissions before operations
2. **Services**: Enforce branch scoping
3. **Database**: RLS policies as final defense

**Example:**

```typescript
// 1. Action checks permission
const hasPermission = await checkPermission('users', 'create', PermissionScope.BRANCH)
if (!hasPermission) {
  return { success: false, error: 'Unauthorized' }
}

// 2. Service enforces branch scoping
const accessibleBranchIds = await getAccessibleBranchIds()
if (!accessibleBranchIds.includes(branchId)) {
  throw new Error('Branch not accessible')
}

// 3. Database RLS prevents unauthorized access
// (even if above checks are bypassed)
```

### Role Hierarchy

**Principle:**

- Users can only manage lower-level users
- Cannot assign equal or higher-level roles

**Implementation:**

```typescript
const currentUserLevel = currentUser.profile.userRoles[0].role.level
const targetRoleLevel = targetRole.level

if (targetRoleLevel <= currentUserLevel) {
  return { success: false, error: 'Cannot assign equal/higher level role' }
}
```

---

## Testing Security

### Manual Testing

**1. Test Security Headers:**

```bash
# Using curl
curl -I https://yourdomain.com

# Look for headers:
# Content-Security-Policy
# X-Frame-Options
# X-Content-Type-Options
# Strict-Transport-Security
```

**2. Test CSP:**

```javascript
// In browser console
// Try loading external script (should be blocked)
const script = document.createElement('script')
script.src = 'https://evil.com/script.js'
document.body.appendChild(script)
// Should see CSP violation error
```

**3. Test Authentication:**

```bash
# Try accessing protected route without auth
curl https://yourdomain.com/users
# Should redirect to login or return 401

# Try accessing other user's data
# Should return 403 Forbidden
```

### Automated Testing

**Security Headers Test:**

```typescript
// tests/security-headers.spec.ts
import { test, expect } from '@playwright/test'

test('should have security headers', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.headers()['x-frame-options']).toBe('DENY')
  expect(response?.headers()['x-content-type-options']).toBe('nosniff')
  expect(response?.headers()['content-security-policy']).toContain("default-src 'self'")
})
```

### Online Security Scanners

**1. Mozilla Observatory:**

- URL: https://observatory.mozilla.org
- Scans for security headers
- Provides security score

**2. Security Headers:**

- URL: https://securityheaders.com
- Analyzes HTTP security headers
- Grades A to F

**3. SSL Labs:**

- URL: https://www.ssllabs.com/ssltest/
- Tests HTTPS configuration
- Checks certificate validity

---

## Security Checklist

### Development

- [ ] Security headers configured
- [ ] CSP tested and working
- [ ] Authentication flow tested
- [ ] RBAC permissions tested
- [ ] File upload validation tested
- [ ] Error messages don't leak sensitive info

### Before Production

- [ ] Change all default credentials
- [ ] Enable HSTS
- [ ] Configure CSP reporting
- [ ] Setup error tracking (Sentry)
- [ ] Enable rate limiting (Task 2.4)
- [ ] Review and test RLS policies
- [ ] Audit exposed API endpoints
- [ ] Test with security scanners
- [ ] Review Supabase security settings
- [ ] Enable database backups

### Production Monitoring

- [ ] Monitor CSP violations
- [ ] Monitor authentication failures
- [ ] Monitor rate limit hits
- [ ] Review audit logs regularly
- [ ] Update dependencies regularly
- [ ] Review security advisories

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

---

## Reporting Security Issues

If you discover a security vulnerability, please email: security@yourdomain.com

**Please do not:**

- Open a public GitHub issue
- Disclose the vulnerability publicly
- Exploit the vulnerability

**Please include:**

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response Time:**

- We aim to respond within 24 hours
- We aim to fix critical issues within 7 days

---

**Last Updated:** 2025-11-25
**Maintained By:** Security Team
