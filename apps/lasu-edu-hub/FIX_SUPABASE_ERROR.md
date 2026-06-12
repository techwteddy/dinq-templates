# Fixing the Supabase Connection Error

## Error You're Seeing

```
[v0] Error fetching courses: {}
at getCourses (lib/storage.ts:56:13)
```

This error typically means the Supabase client cannot connect to your database.

## Common Causes & Solutions

### Cause 1: Environment Variables Not Set

**Problem:** The app can't find your Supabase credentials.

**Symptoms:**
- Console shows: "Supabase URL: Not set" or "Supabase Key: Not set"
- Error appears immediately on page load

**Solution:**
1. Create `.env.local` in your project root with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Get these values from Supabase:
   - Dashboard → Settings → API
   - Copy "Project URL" (don't include /rest/v1)
   - Copy "anon public" under "Keys"

3. Restart your dev server (`pnpm dev`)

### Cause 2: Wrong API Key Format

**Problem:** You copied the wrong key from Supabase.

**Symptoms:**
- Auth error messages
- 401 Unauthorized errors

**Solution:**
- Make sure you're using the **anon public key**, not the service role key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The anon key is shorter (usually 100+ chars) and safe to expose in frontend code
- Service role key is longer and only for backend (env variables only)

### Cause 3: Database Tables Don't Exist

**Problem:** Tables weren't created during migration.

**Symptoms:**
- Empty `{}` error
- "relation does not exist" errors

**Solution:**
1. Run the migration script:
```bash
pnpm migrate
```

2. Or manually create tables in Supabase:
   - Go to SQL Editor
   - Run the commands from `scripts/init-supabase.sql`

### Cause 4: Network/Firewall Issue

**Problem:** Can't reach Supabase servers.

**Symptoms:**
- CORS errors
- Connection timeout errors
- Works locally but not on Vercel

**Solution:**
1. Check your internet connection
2. Verify the Supabase URL is correct (no typos)
3. Make sure it starts with `https://`
4. Check Supabase status page: https://status.supabase.com

## Step-by-Step Troubleshooting

### Step 1: Check Environment Variables
```bash
# Your .env.local should look like:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Verify in Browser Console
```javascript
// Open browser console (F12) and run:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Both should show values, not undefined
```

### Step 3: Test Supabase Connection Directly
1. Create a test file: `test-supabase.mjs`
2. Add:
```javascript
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing Supabase connection...");
console.log("URL:", url ? "✓" : "✗");
console.log("Key:", key ? "✓" : "✗");

if (url && key) {
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("courses").select("*").limit(1);
  console.log("Connection:", error ? "✗ " + error.message : "✓");
  console.log("Data:", data);
}
```

3. Run: `node test-supabase.mjs`

### Step 4: Check Supabase Dashboard
1. Log in to https://supabase.com
2. Go to your project
3. Check **SQL Editor** → Run:
```sql
SELECT * FROM courses LIMIT 5;
```
This confirms tables exist.

## Quick Fix Checklist

- [ ] Environment variables are set in `.env.local`
- [ ] Supabase URL is correct (copy/paste from Supabase)
- [ ] Using the correct API keys
- [ ] Dev server restarted after env changes
- [ ] Migration has been run (`pnpm migrate`)
- [ ] Tables exist in Supabase dashboard
- [ ] Internet connection is working
- [ ] Supabase project is not paused/deleted

## If Still Not Working

1. **Clear everything and restart:**
   ```bash
   rm .env.local          # Remove env file
   pnpm dev              # Start fresh
   # Error should show "Supabase URL: Not set"
   ```

2. **Create `.env.local` again** with correct values

3. **Run migrations fresh:**
   ```bash
   pnpm migrate
   ```

4. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   pnpm dev
   ```

5. **Test in browser** - Navigate to http://localhost:3000

## Getting Help

If you're still stuck:

1. Check browser console for specific error messages
2. Look at Supabase logs: Dashboard → Logs → API
3. Enable debug logging in storage.ts (look for console.log statements)
4. Compare your setup with SUPABASE_SETUP.md exactly

## Success Signs

When correctly set up, you should see:
- ✅ `[v0] Supabase URL: Set` in console
- ✅ `[v0] Supabase Key: Set` in console
- ✅ Homepage loads with no errors
- ✅ Admin login page loads
- ✅ Can create courses/resources
- ✅ Data persists across page reloads

## Next: Deploy to Vercel

Once working locally, follow DEPLOYMENT.md to deploy with Vercel (which will also need the environment variables set).
