# Quick Fix for "Supabase Error: {}" 

## The Problem

You're seeing console errors like:
```
[v0] Supabase error: {}
[v0] Error fetching courses: {}
```

**Root Cause:** Your Supabase environment variables are not set.

## The Solution (3 Steps)

### Step 1: Get Your Supabase Credentials

1. Go to [app.supabase.com](https://app.supabase.com)
2. Open your project
3. Go to **Settings → API**
4. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Add to Your Project

**For Local Development:**
Create `.env.local` in your project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**For Vercel Deployment:**
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add all three variables
3. Redeploy

### Step 3: Restart & Verify

```bash
# Stop dev server (Ctrl+C)
# Restart with:
pnpm dev
```

Check your console - you should see:
```
[v0] Supabase URL: ✓ Set
[v0] Supabase Key: ✓ Set
[v0] Supabase Configured: true
```

## If Still Not Working

1. Check that `.env.local` exists in your **project root** (not a subfolder)
2. Verify no extra spaces in your keys (copy-paste carefully)
3. Restart dev server: `Ctrl+C` then `pnpm dev`
4. Hard refresh browser: `Ctrl+Shift+R`

## Next: Initialize Database

After environment variables are set:
```bash
pnpm migrate
```

This creates all tables and seeds default data.

## Done!

Your app should now work. Check the browser console for confirmation.

See `ENVIRONMENT_SETUP.md` for detailed setup instructions.
