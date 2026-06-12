# FocusFlow — Google Play Store Launch Guide

> Complete step-by-step checklist from zero to live app on the Play Store.

---

## Phase 1: Prepare Your Assets (Do This First)

Before you touch the Play Console, generate these assets so you don't get blocked later.

### A) App Icons (Required)

Generate with a tool like **Figma**, **Canva**, or **IconKitchen** (icon.kitchen).

| Size | Purpose | Format |
|------|---------|--------|
| 512×512 | Play Store listing icon (high-res) | PNG, 32-bit |
| 192×192 | PWA / TWA icon | PNG |
| 96×96 | Shortcut icons | PNG |

**Rules:**
- No transparency in 512×512 Play Store icon (Google rejects transparent backgrounds)
- No text smaller than 20% of the icon area
- No Google/Android trademarked shapes

**Where to put them:**
```
public/
  icons/
    icon-512x512.png
    icon-192x192.png
    icon-96x96.png
    icon-48x48.png
```

Update `public/manifest.json` to point to the real file paths.

---

### B) Screenshots (Required)

You need **2–8 screenshots per form factor**.

| Form Factor | Size | Minimum Required |
|-------------|------|------------------|
| Phone | 1080×1920 or 1080×2400 | 2 screenshots |
| 7-inch tablet | 1080×1920 | Optional but recommended |
| 10-inch tablet | 1920×1080 | Optional |

**Content rules:**
- No status bar visible (hide it in browser devtools)
- No alpha/transparency
- Show real app UI, not marketing graphics
- Include at least 1 screenshot per core feature (Focus, Tasks, Habits, Insights)

**Where to upload:** Play Console → Grow → Store presence → Main store listing → Screenshots

---

### C) Feature Graphic (Required)

- **1024×500** PNG or JPEG
- This is the banner shown at the top of your Play Store page
- Keep text to the left 2/3 (right side gets cropped on some devices)

---

### D) Privacy Policy (Required)

Google **requires** a privacy policy URL for any app with user accounts or analytics.

Create a simple page at `/privacy` inside your Next.js app:

```tsx
// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-slate-700">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">FocusFlow AI (&quot;we&quot;, &quot;us&quot;) operates the FocusFlow mobile application.</p>
      <h2 className="font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p>Email address, tasks, habits, and focus session metadata. We do not sell data.</p>
      <h2 className="font-semibold mt-6 mb-2">2. How We Use It</h2>
      <p>To provide productivity features, sync across devices, and send account emails.</p>
      <h2 className="font-semibold mt-6 mb-2">3. Contact</h2>
      <p>Email: support@yourdomain.com</p>
    </main>
  );
}
```

Host it at: `https://yourdomain.com/privacy`

---

## Phase 2: Register for Google Play Console

### Step 1 — Create a Google Developer Account

1. Go to **[Google Play Console](https://play.google.com/console)**
2. Sign in with a **dedicated Google Account** (not your personal Gmail if possible)
3. Accept the Developer Distribution Agreement
4. Pay the **$25 USD one-time registration fee** (credit/debit card)
5. Complete identity verification:
   - Business type: **Individual** or **Organization**
   - Name, address, phone number
   - Upload ID (passport/driver's license) for identity check
   - Google reviews this in **24–48 hours**

> ⚠️ **Tip:** Use your real legal name exactly as it appears on your ID. Mismatches cause rejection.

---

## Phase 3: Build the Android App (Trusted Web Activity)

Since FocusFlow is a PWA, you wrap it as a **Trusted Web Activity (TWA)** using **Bubblewrap**.

### Step 1 — Install Bubblewrap CLI

```bash
# Node.js 18+ required
npm install -g @bubblewrap/cli
```

### Step 2 — Initialize the TWA Project

```bash
# From outside your Next.js project folder
mkdir -p ~/focusflow-twa && cd ~/focusflow-twa

bubblewrap init --manifest=https://yourdomain.com/manifest.json
```

It will ask you:
- **Application name:** `FocusFlow AI`
- **Short name:** `FocusFlow`
- **Package ID:** `com.yourcompany.focusflow` (use reverse domain format)
- **Start URL:** `/dashboard` (or `/`)
- **Display mode:** `standalone`
- **Theme color:** `#16a34a`
- **Background color:** `#ffffff`
- **Android SDK:** Accept defaults (Bubblewrap auto-downloads)

> ⚠️ **Critical:** You must own the domain. The `manifest.json` must be publicly accessible at `https://yourdomain.com/manifest.json`.

### Step 3 — Update Asset Links

After init, Bubblewrap creates a file `assetlinks.json`. Replace the contents with your **real** info:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.focusflow",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

**How to get your SHA-256 fingerprint:**

```bash
# After Bubblewrap init, run:
bubblewrap fingerprint add
```

Or manually:
```bash
cd ~/focusflow-twa
keytool -list -v -keystore android.keystore -alias android -storepass YOUR_KEYSTORE_PASSWORD
```

Copy the **SHA256** line into `public/assetlinks.json` in your Next.js project, then redeploy to Vercel.

**Verify the file is accessible:**
```
https://yourdomain.com/.well-known/assetlinks.json
```

Google Chrome and the Play Store require this for TWA validation.

### Step 4 — Build the APK

```bash
# Still inside ~/focusflow-twa
bubblewrap build
```

Output files:
```
app-release-signed.apk        ← Upload this to Play Console
app-release-signed.aab        ← Or this (AAB is preferred by Google now)
```

> Google Play now requires **AAB (Android App Bundle)** for new apps. Bubblewrap generates both. Upload the `.aab`.

---

## Phase 4: Create the Play Store Listing

### Step 1 — Create a New App

1. Go to **[Play Console](https://play.google.com/console)** → **Create app**
2. Fill in:
   - **App name:** `FocusFlow AI`
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:**
     - ✅ Contains ads — **No**
     - ✅ Content ratings — fill out the questionnaire (Productivity apps are usually **Everyone**)
     - ✅ Target audience — choose appropriate ages (typically **18+ only** to avoid COPPA complications, or select actual ages and comply with family policies)
     - ✅ Data safety — complete the form (email, app interactions, crash logs)
     - ✅ Privacy policy URL — paste your `/privacy` link

### Step 2 — Store Listing Content

| Field | What to Write |
|-------|---------------|
| **Short description** (80 chars) | AI productivity coach with focus timer, tasks & habits. |
| **Full description** (4000 chars max) | Write a compelling 3-4 paragraph description covering: what the app does, who it's for, key features, and a CTA. See template below. |
| **App category** | **Productivity** |
| **Tags** | Pomodoro, Task Manager, Habit Tracker, AI Productivity |
| **Contact email** | Your real support email |

**Full description template:**

```
FocusFlow AI is your personal productivity coach — right on your phone.

🍅 Focus Timer — Pomodoro sessions with break reminders and session history.
✅ Smart Tasks — Capture, prioritize, and complete tasks with AI-powered suggestions.
🔥 Habit Tracker — Build atomic habits with daily streaks that keep you motivated.
🤖 AI Insights — Personalized tips based on your real productivity patterns.

Whether you're a student, developer, or creative professional, FocusFlow helps you spend less time organizing and more time doing deep work.

Key Features:
• Offline-first — your timer works even without internet
• Cross-device sync via secure cloud account
• Beautiful, distraction-free design
• Daily stats and streak heatmaps

Start your first 25-minute focus session today.
```

### Step 3 — Upload Assets

Go to **Grow → Store presence → Main store listing**:

1. Upload **app icon** (512×512)
2. Upload **feature graphic** (1024×500)
3. Upload **phone screenshots** (2–8 images)
4. Upload **tablet screenshots** (optional but recommended)

### Step 4 — Content Rating

1. Go to **Policy → App content → Content ratings**
2. Fill the questionnaire:
   - Violence: None
   - Sexual content: None
   - Language: None
   - Substances: None
   - Mature themes: None
   - Gambling: None
3. Click **Save** → **Calculate rating**

You will likely get **Everyone** or **Everyone 10+**.

---

## Phase 5: Upload and Test

### Step 1 — App Bundle Upload

1. Go to **Release → Production → Create new release**
2. Upload your `.aab` file (from `~/focusflow-twa/app-release-signed.aab`)
3. Google Play will show:
   - Version name: `1.0`
   - Version code: `1`
   - Target SDK: 33+ (handled by Bubblewrap)
4. Add release notes:
   ```
   Initial release of FocusFlow AI.
   • Focus timer with Pomodoro technique
   • Task manager with AI insights
   • Habit tracker with streaks
   • Google & Magic Link sign-in
   ```
5. Click **Review release**

### Step 2 — Internal Testing (Strongly Recommended)

Before production, create an **Internal testing** track:

1. **Release → Internal testing → Create new release**
2. Upload the same `.aab`
3. Add testers by email (your own phone's Gmail account)
4. Copy the **Opt-in URL** and open it on your Android phone
5. Install via Play Store Internal Testing link
6. Test **every feature**: sign-in, timer, add task, add habit, offline mode, install prompt

> ⚠️ **If the TWA doesn't open in fullscreen** or shows a browser address bar, your `assetlinks.json` is wrong or not accessible. Fix and rebuild.

---

## Phase 6: Go Live

### Step 1 — Production Release

1. Once internal testing passes, go to **Release → Production**
2. Click **Create new release**
3. Upload the same `.aab` (or promote from Internal Testing)
4. Add release notes
5. Click **Start rollout to Production**

### Step 2 — Wait for Review

- **Standard review:** 1–3 business days
- During review, status shows "**In review**"
- If rejected, Google emails you with exact policy violations

### Step 3 — Publish

After approval:
- Status changes to "**Available on Google Play**"
- Your app is live at: `https://play.google.com/store/apps/details?id=com.yourcompany.focusflow`
- Share the link on your landing page (`/CTA` section)

---

## Phase 7: Post-Launch Maintenance

### Update Cycle

| Task | Frequency |
|------|-----------|
| Update screenshots for new features | Every major release |
| Update release notes | Every update |
| Respond to user reviews | Daily for first 2 weeks |
| Check crash reports (Play Console) | Weekly |
| Update `.aab` when web app changes | When you add major features |

### Rebuilding After Web Changes

If you update the web app (new features, bug fixes), the TWA auto-updates **for most users** because it loads the live web app.

However, if you change:
- App name or icon
- `manifest.json` display mode
- `assetlinks.json` fingerprint

Then you must rebuild and submit a new `.aab`.

```bash
cd ~/focusflow-twa
bubblewrap update
bubblewrap build
# Upload new aab to Play Console
```

---

## Troubleshooting Common Rejections

| Rejection Reason | Fix |
|------------------|-----|
| "App doesn't install or crashes" | Test the `.aab` on a real device via internal testing first |
| "Privacy policy missing" | Host `/privacy` on your exact domain, paste exact URL |
| "App loads web content but isn't a webview" | Ensure TWA opens in standalone mode, not browser tab. Verify `assetlinks.json` |
| "Missing login functionality" | If you have auth, test login in the internal build from Play Store |
| "Deceptive behavior" | Don't hide features behind paywalls without disclosure. Don't fake AI. |
| "Excessive permissions" | Remove unused permissions from `twa-manifest.json`. FocusFlow needs none. |

---

## Cost Summary

| Item | Cost |
|------|------|
| Google Play Developer account | $25 USD (one-time) |
| Domain (yourdomain.com) | ~$12/yr |
| Vercel hosting | Free tier (up to 100GB bandwidth) |
| Supabase | Free tier (500MB DB, 2GB bandwidth) |
| Upstash Redis (rate limiting) | Free tier (10k commands/day) |
| Resend (emails) | Free tier (3k emails/day) |
| Bubblewrap CLI | Free (open source) |

**Total launch cost: ~$37 USD**

---

## Quick Reference: Command Cheat Sheet

```bash
# 1. Deploy web app
vercel --prod

# 2. Build TWA
cd ~/focusflow-twa
bubblewrap init --manifest=https://yourdomain.com/manifest.json
bubblewrap build

# 3. Get fingerprint
bubblewrap fingerprint add
# or
keytool -list -v -keystore android.keystore -alias android

# 4. Update web assetlinks
# Edit public/.well-known/assetlinks.json in Next.js project
vercel --prod

# 5. Rebuild after web update
bubblewrap update
bubblewrap build

# 6. Upload
# Play Console → Production → Upload app-release-signed.aab
```

---

## Status Tracker

- [ ] Icons generated (512, 192, 96)
- [ ] Screenshots captured (2+ phone)
- [ ] Feature graphic designed (1024×500)
- [ ] Privacy policy page live at `/privacy`
- [ ] Domain purchased & connected to Vercel
- [ ] Web app deployed and publicly accessible
- [ ] Play Console developer account registered ($25 paid)
- [ ] Bubblewrap initialized with correct manifest URL
- [ ] Assetlinks.json deployed and verified
- [ ] APK/AAB built and tested on physical device
- [ ] Internal testing track created + tested
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Production release submitted
- [ ] App approved and live on Play Store 🎉
