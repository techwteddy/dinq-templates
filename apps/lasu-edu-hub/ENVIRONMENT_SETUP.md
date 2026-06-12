# Supabase Environment Setup Guide

## The Error You're Seeing

The console errors `[v0] Supabase error: {}` occur because the environment variables are missing or not properly set. The empty error object `{}` is a sign that the Supabase client can't authenticate.

## Required Environment Variables

You need to set **THREE** environment variables in your Vercel project or local `.env.local` file:

1. **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your public anonymous key
3. **SUPABASE_SERVICE_ROLE_KEY** - Your service role key (for migrations)

## Getting Your Supabase Credentials

### Step 1: Create a Supabase Account
Go to [supabase.com](https://supabase.com) and sign up (free tier works great)

### Step 2: Create a New Project
- Click "New Project"
- Enter a project name (e.g., "STESSA Resource Hub")
- Choose a database password (save this!)
- Select your region (closest to you)
- Wait 2-5 minutes for project to initialize

### Step 3: Get Your API Keys
1. Go to **Settings → API** in your Supabase project
2. Under "Project API keys" you'll see:
   - **`anon` (public)** - Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role`** - Copy this for `SUPABASE_SERVICE_ROLE_KEY`
3. In the URL box at the top, you'll see your project URL
   - Copy this for `NEXT_PUBLIC_SUPABASE_URL`

## Setting Environment Variables

### For Local Development

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Then restart your dev server: `pnpm dev`

### For Vercel Deployment

1. Go to your Vercel project settings
2. Click **"Environment Variables"**
3. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy your project

## Initializing the Database

After setting environment variables:

```bash
# Local
pnpm migrate

# Or on Vercel, use the Vercel CLI
vercel env pull
pnpm migrate
```

This will create all necessary tables and seed default data.

## Verify It's Working

Check your browser console - you should see:
```
[v0] Supabase URL: ✓ Set
[v0] Supabase Key: ✓ Set
[v0] Supabase Configured: true
```

If you see `✗ NOT SET`, go back and check your environment variables.

## Troubleshooting

### Still Getting Empty Error Objects?

1. **Check the console logs** - Look for `[v0] Supabase Configured: false`
2. **Verify your keys** - Copy-paste them again (no extra spaces!)
3. **Restart dev server** - After adding `.env.local`, restart with `pnpm dev`
4. **Check Supabase project** - Make sure it's initialized and tables exist

### Database Not Found?

Run the migration: `pnpm migrate`

### "SUPABASE_SERVICE_ROLE_KEY not found"?

This is only needed for migrations. You can skip it if tables already exist in your Supabase project.

## File Upload Not Working?

After setting environment variables, you also need to create the storage bucket:

1. Go to **Storage** in your Supabase dashboard
2. Click **"Create Bucket"**
3. Name it: `resources`
4. Allow public access (check "Public bucket")
5. Max file size: 100MB

Or run `pnpm migrate` which creates it automatically.

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Check your Supabase project dashboard: https://app.supabase.com
- Look at FIX_SUPABASE_ERROR.md for more troubleshooting
