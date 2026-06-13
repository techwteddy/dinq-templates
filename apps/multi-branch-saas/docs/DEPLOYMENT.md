# 🚀 Deployment Guide

This guide covers deploying the Branch Management Boilerplate to production using Vercel and Supabase.

## 📋 Prerequisites

- GitHub account (for Vercel integration)
- Vercel account (free tier works)
- Supabase account (free tier works)
- Project repository pushed to GitHub

## 🎯 Quick Deployment Checklist

- [ ] Create Supabase production project
- [ ] Setup database schema (migrations)
- [ ] Configure Supabase Auth
- [ ] Setup Storage buckets and policies
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Seed initial Super Admin user
- [ ] Test authentication and features

---

## 1️⃣ Supabase Production Setup

### Step 1.1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** Branch Management Prod (or your preferred name)
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient to start
4. Click **"Create new project"** and wait ~2 minutes for setup

### Step 1.2: Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** - `https://[project-ref].supabase.co`
   - **Anon/Public Key** - `eyJhbGc...` (starts with eyJ)
   - **Service Role Key** - `eyJhbGc...` (KEEP SECRET!)

3. Go to **Project Settings** → **Database**
4. Scroll to **Connection String** → **URI**
5. Copy the **Connection pooler** string (for Prisma):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   Replace `[password]` with your database password from Step 1.1

### Step 1.3: Run Database Migrations

You have two options to run migrations:

#### Option A: Using Supabase Studio (Recommended for first-time)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file manually from `prisma/migrations/` folder
3. Execute them in chronological order (oldest first)

#### Option B: Using Prisma CLI (Recommended for experienced users)

```bash
# Set production database URL temporarily
export DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Deploy migrations to production
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status
```

### Step 1.4: Configure Supabase Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize: Confirm signup, Reset password, Magic Link

4. Configure Auth settings:
   - Go to **Authentication** → **Settings**
   - **Site URL:** `https://yourdomain.com` (your Vercel domain)
   - **Redirect URLs:** Add your Vercel domain:
     ```
     https://yourdomain.com/**
     https://yourdomain.vercel.app/**
     ```

### Step 1.5: Setup Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create two buckets:

   **Bucket 1: avatars**
   - Name: `avatars`
   - Public bucket: **Yes** ✅
   - File size limit: 2 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket 2: logos**
   - Name: `logos`
   - Public bucket: **Yes** ✅
   - File size limit: 2 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/svg+xml`

3. Configure Storage RLS policies:
   - Go to **Storage** → **Policies**
   - For both buckets, add these policies:

   **Policy 1: Public Read Access**

   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'avatars'); -- or 'logos'
   ```

   **Policy 2: Authenticated Upload**

   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'avatars' -- or 'logos'
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 3: Owner Update/Delete**

   ```sql
   CREATE POLICY "Users can update/delete own files"
   ON storage.objects FOR UPDATE
   USING (auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   USING (auth.uid()::text = (storage.foldername(name))[1]);
   ```

---

## 2️⃣ Vercel Deployment

### Step 2.1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 2.2: Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables

| Variable                        | Value                                                                                                            | Notes                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `DATABASE_URL`                  | `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | From Supabase → Database → Connection pooler  |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://[project-ref].supabase.co`                                                                              | From Supabase → Settings → API                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...`                                                                                                     | From Supabase → Settings → API → anon/public  |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGc...`                                                                                                     | From Supabase → Settings → API → service_role |

#### Optional Variables (Recommended)

| Variable              | Value                           | Notes                          |
| --------------------- | ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.vercel.app` | Your Vercel deployment URL     |
| `MAX_BRANCH_DEPTH`    | `5`                             | Maximum branch hierarchy depth |

#### Future Integrations (Add when needed)

| Variable                 | Purpose                        |
| ------------------------ | ------------------------------ |
| `EMAIL_FROM`             | Sender email for notifications |
| `RESEND_API_KEY`         | Resend.com API key for emails  |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking          |
| `SENTRY_AUTH_TOKEN`      | Sentry auth token              |

**Important Notes:**

- ✅ **DO** add all required variables before first deployment
- ⚠️ **NEVER** commit service role key to git
- 🔄 Changes to env vars require redeployment

### Step 2.3: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Once deployed, you'll get a URL: `https://your-project.vercel.app`

---

## 3️⃣ Post-Deployment Setup

### Step 3.1: Seed Super Admin User

After successful deployment, you need to create the initial Super Admin user.

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set production environment variables locally
vercel env pull .env.production

# Run seed script
DATABASE_URL="<your-production-database-url>" npx tsx prisma/seed.ts
```

**Option B: Using Supabase SQL Editor**

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the seed script manually (see `prisma/seed.ts` for reference)
3. Create:
   - HQ branch
   - Super Admin user profile
   - Super Admin role with all permissions

**Option C: Using Admin Dev Tools (After first login)**

1. Login with any Supabase Auth user
2. Manually promote user to Super Admin in Supabase Studio
3. Use `/admin/dev-tools` → **Sample Data Seeding** to setup data

### Step 3.2: Verify Deployment

Test these critical features:

1. **Authentication:**

   ```
   ✅ Login page loads
   ✅ Can login with Super Admin credentials
   ✅ Session persists after refresh
   ✅ Logout works
   ```

2. **Database Connection:**

   ```
   ✅ Dashboard loads without errors
   ✅ User list displays
   ✅ Branch hierarchy displays
   ```

3. **File Upload:**

   ```
   ✅ Can upload avatar
   ✅ Image displays correctly
   ✅ Can replace existing image
   ```

4. **Real-time Updates:**
   ```
   ✅ Open two browsers
   ✅ Edit user in one browser
   ✅ See update in other browser
   ```

### Step 3.3: Custom Domain (Optional)

1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain: `yourdomain.com`
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Supabase Auth redirect URLs

---

## 4️⃣ Monitoring & Maintenance

### Error Tracking (Recommended)

**Setup Sentry for production error tracking:**

1. Create account at [sentry.io](https://sentry.io)
2. Create new Next.js project
3. Get DSN and auth token
4. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
   ```
5. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

### Performance Monitoring

**Vercel Analytics (Built-in):**

- Go to Vercel Dashboard → **Analytics**
- View page load times, Web Vitals, and traffic

**Supabase Monitoring:**

- Go to Supabase Dashboard → **Reports**
- Monitor: Database size, API requests, Storage usage

### Database Backups

**Supabase Automatic Backups (Free tier):**

- Daily backups retained for 7 days
- Go to **Database** → **Backups** to restore

**Manual Backup:**

```bash
# Export database to SQL file
pg_dump <database-url> > backup.sql

# Restore from backup
psql <database-url> < backup.sql
```

---

## 5️⃣ CI/CD Automation (Optional)

### Automatic Deployments

Vercel automatically deploys on:

- ✅ Push to `main` branch → Production deployment
- ✅ Push to other branches → Preview deployment
- ✅ Pull requests → Preview deployment with unique URL

### Preview Deployments

Each PR gets a unique preview URL:

```
https://your-project-git-<branch>-<username>.vercel.app
```

**Best Practices:**

- Test features on preview deployments before merging
- Share preview URLs with team for review
- Check Vercel deployment comments on GitHub PRs

### GitHub Actions Integration (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Build
        run: npm run build

      # Vercel will handle actual deployment
```

---

## 6️⃣ Troubleshooting

### Common Issues

#### Issue: Build Fails on Vercel

**Symptoms:**

```
Error: Cannot find module '@prisma/client'
```

**Solution:**

```bash
# Add postinstall script to package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### Issue: Database Connection Fails

**Symptoms:**

```
Error: P1001: Can't reach database server
```

**Solutions:**

1. ✅ Verify `DATABASE_URL` is correct in Vercel env vars
2. ✅ Use **connection pooler** URL (port 6543), not direct connection
3. ✅ Ensure `?pgbouncer=true` is at the end of connection string
4. ✅ Check Supabase project isn't paused (free tier pauses after 7 days inactivity)

#### Issue: Authentication Redirects Fail

**Symptoms:**

- Login redirects to wrong URL
- "Invalid redirect URL" error

**Solutions:**

1. ✅ Add Vercel domain to Supabase → **Auth** → **URL Configuration**
2. ✅ Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
3. ✅ Redeploy after env var changes

#### Issue: File Upload Fails

**Symptoms:**

```
Error: Storage bucket not found
```

**Solutions:**

1. ✅ Verify `avatars` and `logos` buckets exist in Supabase
2. ✅ Check bucket policies are configured (see Step 1.5)
3. ✅ Ensure buckets are set to **public**

#### Issue: Real-time Updates Don't Work

**Symptoms:**

- Changes in one browser don't appear in another

**Solutions:**

1. ✅ Verify Supabase Realtime is enabled:
   - Go to **Database** → **Replication**
   - Enable replication for `users`, `branches`, `audit_logs` tables
2. ✅ Check browser console for WebSocket errors
3. ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Debug Mode

Enable verbose logging in production (temporarily):

```typescript
// Add to lib/supabase/client.ts
const supabase = createClient(url, anonKey, {
  auth: {
    debug: true, // Enable auth debug logs
  },
  global: {
    headers: {
      'x-debug': 'true',
    },
  },
})
```

---

## 7️⃣ Security Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] Service role key is **NEVER** exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] Storage bucket policies are configured
- [ ] CORS is configured in Supabase (if using custom domain)
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Rate limiting is implemented (Week 2 Task 2.4)
- [ ] Security headers are configured (Week 2 Task 2.3)
- [ ] Strong password requirements are enforced
- [ ] Email verification is enabled (optional)

---

## 8️⃣ Performance Optimization

### Recommended Settings

**Vercel:**

- Enable **Edge Caching** for static pages
- Configure **ISR** (Incremental Static Regeneration) for dynamic pages
- Use **Vercel Image Optimization** for uploaded images

**Supabase:**

- Enable **Connection Pooling** (use pooler URL)
- Add database indexes for frequently queried fields
- Monitor **Query Performance** in Supabase Dashboard

**Next.js:**

- Use Server Components by default
- Implement `loading.tsx` for instant loading states
- Use `<Image>` component for optimized images
- Enable static exports where possible

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues)
2. Review [Vercel Deployment Logs](https://vercel.com/docs/observability/runtime-logs)
3. Check [Supabase Logs](https://supabase.com/docs/guides/platform/logs)
4. Contact project maintainers

---

**Last Updated:** 2025-11-25
**Maintained By:** Development Team
