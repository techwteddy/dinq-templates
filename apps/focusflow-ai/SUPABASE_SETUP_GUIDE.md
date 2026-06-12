# Step 1: Supabase Setup Guide (Do This First)

> This is the ONLY thing you need to do right now. Everything else waits until this is done.

---

## What You Need Before Starting

1. A **Google account** (Gmail) — you already have one
2. About **10 minutes** of focused time
3. Nothing else installed on your computer yet

---

## STEP 1: Create Your Supabase Account (2 minutes)

### 1.1 Go to Supabase
Open your browser and go to: **https://supabase.com**

### 1.2 Click "Start your project"
You will see a green button. Click it.

### 1.3 Sign up
- Click **"Continue with GitHub"** (recommended — fastest)
- OR use your Google account
- Authorize Supabase to access your GitHub (this is safe — it just reads your email)

### 1.4 Create an organization
- Organization name: `focusflow` (or anything you want — this is just a folder name)
- Click **"Create organization"**

---

## STEP 2: Create a New Project (2 minutes)

### 2.1 Click "New project"
Inside your organization dashboard, click the green **"New project"** button.

### 2.2 Fill in project details
| Field | What to Type | Why |
|-------|--------------|-----|
| **Name** | `focusflow` | This becomes part of your URL |
| **Database Password** | Click **"Generate a password"** — copy it immediately to a notepad | You NEED this password. Never lose it. |
| **Region** | Choose the closest to your users | US East (N. Virginia) for US users, Singapore for Asia, Frankfurt for Europe |
| **Pricing Plan** | **Free** | Upgrade later when you have users |

### 2.3 Click "Create new project"
Wait 1–2 minutes. Supabase is spinning up your database. You will see a loading screen.

---

## STEP 3: Get Your API Keys (3 minutes)

This is the most important step. You need 3 pieces of information.

### 3.1 Open Project Settings
Once your project is ready, click **"Project Settings"** in the left sidebar (bottom of the sidebar, looks like a gear icon).

### 3.2 Click "API" in the left menu
Under Project Settings, click **"API"**. You will see a page with keys.

### 3.3 Copy these EXACT values

You will see a section called **"Project API keys"**. Copy these two:

1. **URL** — looks like: `https://abcdefghijklmnopqrs.supabase.co`
   - This is your `NEXT_PUBLIC_SUPABASE_URL`

2. **anon public** key — looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a long random string)
   - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.4 Get the Service Role Key
Still on the API page, scroll down to **"Service role secret"**.
- Click **"Reveal"**
- Copy this long secret key
- This is your `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **WARNING:** The Service Role Key bypasses ALL security. Never share it. Never put it in frontend code. Our app already handles this correctly — it only uses this key on the server.

### 3.5 Save these in a notepad file
Create a temporary text file on your computer and paste:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace with your actual values. Keep this file open — you need it soon.

---

## STEP 4: Run the Database Schema (3 minutes)

This creates all the tables your app needs.

### 4.1 Go to SQL Editor
In the left sidebar of Supabase, click **"SQL Editor"**.

### 4.2 Click "New query"
A blank code editor opens.

### 4.3 Paste the FIRST migration file
Open the file `ai-productivity-coach/supabase/migrations/001_initial.sql` from your computer.
Copy the ENTIRE contents (Ctrl+A, Ctrl+C).
Paste it into the Supabase SQL Editor.

### 4.4 Click "Run"
The green **"Run"** button is in the top right. Click it.

You should see green checkmarks and a message like:
```
Success. No rows returned.
```

### 4.5 Run the SECOND migration file
Now open `ai-productivity-coach/supabase/migrations/002_rls_policies.sql`.
Copy the entire contents.
In Supabase SQL Editor, click **"New query"** again.
Paste the contents.
Click **"Run"**.

### 4.6 Verify it worked
In the left sidebar, click **"Table Editor"**.
You should see these tables listed:
- `profiles`
- `tasks`
- `habits`
- `focus_sessions`
- `ai_suggestions`
- `waitlist`
- `contact_submissions`
- `page_analytics`

If you see all 8 tables, you are done with the database!

---

## STEP 5: Set Up Authentication (2 minutes)

Your app needs users to sign in. Supabase handles this for free.

### 5.1 Go to Authentication settings
In the left sidebar, click **"Authentication"** (has a shield icon).

### 5.2 Enable Email provider
You should already see "Email" in the list. Make sure:
- **Enable Email provider** — toggle is ON ✅
- **Confirm email** — turn this OFF for easier testing (you can turn it on later when live)

### 5.3 Enable Google provider
1. Click **"Providers"** tab at the top
2. Find **Google** in the list
3. Click the toggle to turn it **ON**
4. For now, leave Client ID and Secret empty (we will add this later if you want Google login — Magic Link works without this)

### 5.4 Add your website URL
1. In Authentication, click **"URL Configuration"** tab
2. Find **"Site URL"** — change it from `http://localhost:3000` to your production URL
   - For now, if you haven't deployed yet, keep `http://localhost:3000` AND add:
   - Click **"Add URL"** under Redirect URLs
   - Add: `https://yourdomain.com/auth/callback` (replace with your actual domain later)

For now, add BOTH:
- `http://localhost:3000/auth/callback`
- `https://yourdomain.com/auth/callback` (if you know your Vercel domain)

> If you don't know your domain yet, that's fine. You can add it after deploying to Vercel. Just remember to come back here.

---

## STEP 6: Copy Keys to Your App (2 minutes)

Now you connect Supabase to your app code.

### 6.1 Open the .env file
In your project folder `ai-productivity-coach/`, find the file named `.env.example`.
Copy it and rename the copy to `.env.local`.

### 6.2 Paste your keys
Open `.env.local` in any text editor (Notepad, VS Code, anything).
Replace the placeholder values with your REAL keys from Step 3.

It should look exactly like this (but with your real values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnopqrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual keys.

### 6.3 Save the file
Press Ctrl+S (or Cmd+S on Mac).

---

## ✅ SUPABASE IS DONE

You now have:
- ✅ A running PostgreSQL database
- ✅ 8 tables created with proper columns
- ✅ Row Level Security (RLS) policies protecting user data
- ✅ Authentication ready (Email + Google OAuth)
- ✅ API keys connected to your app code

---

## What Comes Next (Don't do these yet — wait for my next message)

After Supabase is working, the next steps will be:

**STEP 2:** Deploy your app to Vercel (free, takes 5 minutes)
**STEP 3:** Test the app in your browser
**STEP 4:** Wrap it as an Android app using Bubblewrap
**STEP 5:** Upload to Google Play Console
**STEP 6:** Go live on Play Store

---

## Common Problems & Fixes

### "I can't find Project Settings"
Look at the very bottom of the left sidebar in Supabase. There's a gear icon that says **"Project Settings"**. Click it.

### "The SQL query failed"
Make sure you copied the ENTIRE file contents, not just part of it. If one query fails, scroll down to see the red error message. Usually it's because a table already exists from a previous attempt. That's fine — the tables are already created.

### "I lost my Service Role Key"
Go back to Project Settings → API → scroll to Service Role Secret → click Reveal again. You can view it anytime.

### "Tables don't show in Table Editor"
Click the refresh icon (circular arrows) next to "Table Editor" in the sidebar. Or just wait 10 seconds and check again.
