# Step 2: Deploy to Vercel (Make Your App Live on the Internet)

> This puts your app on a real website URL so you and anyone else can use it.

---

## What You Need Before Starting

1. Your **3 Supabase keys** copied in a notepad (from Step 1)
2. A **GitHub account** (free, sign up at github.com if you don't have one)
3. About **5 minutes**

---

## STEP 1: Push Your Code to GitHub (2 minutes)

You need to put your code on GitHub so Vercel can read it.

### 1.1 Install Git
If you don't have Git installed:
- **Windows:** Download from https://git-scm.com/download/win
- **Mac:** Open Terminal, type `git --version`, if not installed it will prompt you to install
- **Linux:** `sudo apt install git`

### 1.2 Create a New Repository on GitHub
1. Go to **https://github.com/new**
2. **Repository name:** `focusflow-ai`
3. Select **"Public"** (or Private — Vercel works with both)
4. **DO NOT** check "Add a README" or any other boxes
5. Click **"Create repository"**

### 1.3 Push Your Local Code
Open a terminal/command prompt in your project folder (`ai-productivity-coach/`) and run these commands ONE BY ONE:

```bash
# Tell Git to track this folder
git init

# Add all files
git add .

# Save the files with a message
git commit -m "Initial FocusFlow app"

# Connect to your GitHub repo (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/focusflow-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**After this, refresh your GitHub page. You should see all your code files there.**

---

## STEP 2: Connect to Vercel (3 minutes)

### 2.1 Go to Vercel
Open **https://vercel.com**

### 2.2 Sign Up / Log In
- Click **"Sign Up"**
- Choose **"Continue with GitHub"**
- Authorize Vercel to access your repos

### 2.3 Import Your Project
1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your `focusflow-ai` repo in the list
3. Click **"Import"**

### 2.4 Configure the Project
On the import screen, you should see:

| Field | What to Select |
|-------|---------------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (leave as default) |
| **Build Command** | `next build` (leave as default) |
| **Output Directory** | `.next` (leave as default) |

### 2.5 Add Your Environment Variables
This is the MOST IMPORTANT step. Click **"Environment Variables"** to expand it.

Add these 3 variables (copy-paste from your notepad):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ltbqqirbjahrikvgfow.supabase.co` (your URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from Step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key from Step 1 |

To add each one:
1. Type the **Name** in the left box
2. Paste the **Value** in the right box
3. Click **"Add"**
4. Repeat for all 3

> **Note:** Leave the optional ones (UPSTASH_REDIS, RESEND, SENTRY) empty for now. The app works without them.

### 2.6 Deploy
Click the big **"Deploy"** button.

Vercel will now:
- Download your code
- Install dependencies
- Build the app
- Deploy it to the internet

**Wait 1–2 minutes.** You will see a progress bar.

---

## STEP 3: Your App is Live! 🎉

When deployment finishes, Vercel shows you a **URL** like:

```
https://focusflow-ai-xyz123.vercel.app
```

**Click this URL.** Your app is now live on the internet!

### Save This URL
Copy this URL and paste it in your notepad. You need it for:
- Step 3 (testing)
- Step 4 (Play Store setup)
- Supabase URL Configuration (update later)

---

## STEP 4: Update Supabase with Your Live URL (1 minute)

Now that you have a real URL, tell Supabase about it.

1. Go back to **Supabase** → your project
2. Click **Authentication** in the left sidebar
3. Click **URL Configuration**
4. Change **Site URL** from `http://localhost:3000` to your real Vercel URL:
   ```
   https://focusflow-ai-xyz123.vercel.app
   ```
5. Under **Redirect URLs**, add another one:
   ```
   https://focusflow-ai-xyz123.vercel.app/auth/callback
   ```
6. Click **Save**

---

## ✅ VERCEL DEPLOYMENT IS COMPLETE

You now have:
- ✅ A live website on the internet
- ✅ Your database connected
- ✅ Login working (Magic Link)

---

## Quick Test (Do This Now)

1. Open your Vercel URL in a browser
2. You should see the FocusFlow landing page
3. Click **"Get Started Free"**
4. Type your email
5. Check your email inbox for the Magic Link
6. Click the link — you should be logged into the Dashboard!

If this works, everything is connected correctly.

---

## Common Problems

### "Build failed" on Vercel
Click the failed deployment, scroll down to see the red error message. Usually it's:
- Missing environment variable → Go back and add the 3 Supabase keys
- TypeScript error → Check the error file and line number

### "Module not found" errors
Make sure your `package.json` has all dependencies. If you added packages locally but didn't push to GitHub, push again:
```bash
git add .
git commit -m "fix deps"
git push
```

### App loads but login doesn't work
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in Vercel Environment Variables
- Check that URL Configuration in Supabase has your Vercel domain

---

## Next Step: After Vercel Works

Once you confirm the app loads and you can log in, I will give you:

**Step 3: Build the Android App** (Bubblewrap — 5 minutes)
**Step 4: Upload to Google Play Store**

---

## One-Line Summary

```
GitHub → Vercel import → Add 3 env vars → Deploy → Update Supabase URL → Test login
```
