# Quick Setup Guide for SipStream

## Your Supabase Connection Details

**Connection String:**

```
postgresql://postgres:Kealamoose5698@db.yrlmvuszzssdishtdhbl.supabase.co:5432/postgres
```

**Project URL:**

```
https://yrlmvuszzssdishtdhbl.supabase.co
```

**API Key:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybG12dXN6enNzZGlzaHRkaGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjA3NzQsImV4cCI6MjA2NzIzNjc3NH0.-sEXIXrqszhuMTqK1vkx-V_M7GEfWJeXTUhFGxNuL1E
```

## Step 1: Set Up Database

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/yrlmvuszzssdishtdhbl
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to create all tables and policies

## Step 2: Enable Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Make sure **Email auth** is enabled
3. Optionally configure email templates if desired

## Step 3: Enable Realtime

1. In Supabase dashboard, go to **Database** → **Replication**
2. Make sure **Realtime** is enabled for both tables:
   - `games`
   - `game_history`

## Step 4: Deploy Your App

### Option A: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://yrlmvuszzssdishtdhbl.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybG12dXN6enNzZGlzaHRkaGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjA3NzQsImV4cCI6MjA2NzIzNjc3NH0.-sEXIXrqszhuMTqK1vkx-V_M7GEfWJeXTUhFGxNuL1E`
4. Deploy!

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add the same environment variables as above
6. Deploy!

## Step 5: Test Your App

1. Visit your deployed app
2. Create an account or sign in
3. Create a new game
4. Test real-time functionality with multiple browser tabs

## Troubleshooting

### Database Connection Issues

- Verify the connection string is correct
- Check that the database is accessible from your deployment platform

### Authentication Issues

- Ensure email auth is enabled in Supabase
- Check that the API key is correct

### Real-time Not Working

- Verify realtime is enabled for both tables
- Check browser console for connection errors

### Build Errors

- Make sure all environment variables are set correctly
- Check that the database schema was created successfully

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure the database schema is created correctly
4. Check Supabase logs in the dashboard
