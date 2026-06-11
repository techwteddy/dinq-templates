# My Family Genius

A home management PWA for families, built with Next.js 16 and Supabase. Manages calendars, chores, shopping lists, meal planning, home projects, school tests, and a family message board — all behind Google OAuth with role-based access (parents vs. kids).

## Features

- **Calendar** — Family events with recurring support, Google Calendar iCal sync, and email invites with `.ics` attachments
- **Chores** — Household task tracking with daily/weekly/monthly frequency, plus a kids' chore schedule grid with streaks
- **Supermarket** — Shopping lists with categories and a weekly meal plan grid per family member
- **Home Projects** — Kanban-style project board (planned / in-progress / done) with subtasks
- **School Tests** — Track upcoming tests and grades per kid, with parent overview
- **Messages** — Family message board for announcements and notes
- **Push Notifications** — Web push via VAPID for chore reminders, event invites, meal requests, and message alerts
- **PWA** — Installable on mobile with offline support via service worker

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Auth**: Google OAuth via Supabase SSR
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Push**: [web-push](https://github.com/nickersoft/web-push) with VAPID
- **Email**: [Nodemailer](https://nodemailer.com/) with Gmail SMTP
- **Deployment**: [Vercel](https://vercel.com/)
- **Testing**: [Playwright](https://playwright.dev/) (E2E)

## Prerequisites

- Node.js 20+ (24 LTS recommended)
- A [Supabase](https://supabase.com/) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com/) project (for OAuth)
- A [Vercel](https://vercel.com/) account (for deployment)

---

## Setup Guide

### 1. Clone and install

```bash
git clone https://github.com/yuchmanp/my-family-genius.git
cd my-family-genius
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Note your **Project URL** and **anon key** from Settings > API
3. Note your **service role key** from Settings > API (keep this secret!)

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Note the **Client ID** and **Client Secret**
5. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google provider
   - Paste your Client ID and Client Secret

### 4. Run database migrations

Install the Supabase CLI if you haven't:

```bash
npm install -g supabase
```

Link your project and run migrations:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates all tables, RLS policies, and seeds placeholder family members.

### 5. Customize your family

Edit the seed data in the migration files **before** running `supabase db push`, or update directly in the Supabase Dashboard:

**`supabase/migrations/00000000000002_auth.sql`** — Update `allowed_emails` with your family's Google emails:
```sql
INSERT INTO allowed_emails (email) VALUES
  ('parent1@gmail.com'),
  ('parent2@gmail.com');
```

**`supabase/migrations/00000000000006_improvements_v2.sql`** — Update `family_members` with names and roles:
```sql
INSERT INTO family_members (email, name, role) VALUES
  ('parent1@gmail.com', 'Alice', 'parent'),
  ('parent2@gmail.com', 'Bob', 'parent'),
  ('kid1@gmail.com', 'Charlie', 'kid'),
  ('kid2@gmail.com', 'Diana', 'kid');
```

> **Important**: The emails in `allowed_emails` must match the Google accounts your family uses to sign in. The `family_members` table maps emails to display names and roles.

### 6. Generate VAPID keys (for push notifications)

```bash
npx web-push generate-vapid-keys
```

Copy the public and private keys to your `.env.local`.

### 7. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See `.env.example` for descriptions of each variable.

### 8. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page — sign in with a Google account that's in your `allowed_emails` list.

### 9. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Or connect your GitHub repo in the [Vercel Dashboard](https://vercel.com/new) for automatic deployments on push.

**Add environment variables** in Vercel Dashboard > Settings > Environment Variables (copy all values from your `.env.local`).

### 10. Set up cron jobs

The app includes a cron endpoint for checking overdue chores:

- **`/api/cron/check-overdue`** — Sends push notifications for overdue chores

This is configured in `vercel.json` to run daily at 5:00 AM UTC. Vercel Hobby plan supports 1 cron job. For additional crons (e.g., weekly summary), use an external service like [cron-job.org](https://cron-job.org/).

The cron endpoint requires a `CRON_SECRET` Bearer token for authentication.

### 11. Gmail email invites (optional)

To enable calendar event email invites with `.ics` attachments:

1. Enable 2-Step Verification on the Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Add env vars following the pattern `GMAIL_USER_<NAME>` and `GMAIL_APP_PASSWORD_<NAME>`, where `<NAME>` matches the parent's name in `family_members` (uppercased)

Example for a parent named "Alice":
```
GMAIL_USER_ALICE=alice@gmail.com
GMAIL_APP_PASSWORD_ALICE=xxxx xxxx xxxx xxxx
```

---

## Project Structure

```
src/
  app/
    (app)/          # Authenticated pages (calendar, chores, etc.)
    api/cron/       # Cron job endpoints
    login/          # Login page
    auth/callback/  # OAuth callback
    actions.ts      # Server actions
    layout.tsx      # Root layout with metadata
  components/       # UI components organized by feature
  config/           # Navigation config
  lib/              # Supabase clients, push notifications, email
supabase/
  config.toml       # Local Supabase config
  migrations/       # Database schema migrations
  seed.sql          # Seed data
public/
  icons/            # PWA icons
  manifest.json     # PWA manifest
  sw.js             # Service worker
e2e/                # Playwright E2E tests
```

## Development

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test:e2e     # Playwright E2E tests
npm run db:reset     # Reset local Supabase DB
```

## License

MIT
