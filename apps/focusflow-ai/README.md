<p align="center">
  <img src="public/icons/icon-192x192.png" width="80" height="80" alt="FocusFlow Logo" />
</p>

<h1 align="center">FocusFlow AI</h1>
<p align="center">
  <strong>Your personal productivity coach — focus timer, smart tasks, habit streaks & AI insights.</strong><br/>
  Built as a PWA for the web. Wrapped for the Google Play Store via Trusted Web Activity.
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase" alt="Supabase" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" alt="Vercel" /></a>
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/Play%20Store-TWA-green?logo=google-play" alt="Play Store" />
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#play-store">Play Store</a> •
  <a href="#license">License</a>
</p>

---

## 🎬 Demo

> **Live URL:** `https://your-vercel-url.vercel.app` *(update after deployment)*

| Landing | Dashboard | Focus Timer |
|---------|-----------|-------------|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Focus](docs/screenshots/focus.png) |

*(Replace with actual screenshots in `/docs/screenshots/`)*

---

## ✨ Features

- **🍅 Focus Timer** — Pomodoro-style sessions with break reminders, progress ring, and session history sync
- **✅ Smart Tasks** — Capture, prioritize, and complete tasks with optimistic UI updates
- **🔥 Habit Streaks** — Daily check-ins with automatic streak math and longest-streak tracking
- **🤖 AI Insights** — Zero-cost, privacy-first suggestions generated from your real usage patterns (no third-party AI APIs)
- **🔐 Authentication** — Magic Link + Google OAuth via Supabase Auth
- **📱 PWA + Offline** — Service worker, offline fallback, background sync for focus sessions
- **🚀 Play Store Ready** — Trusted Web Activity (TWA) wrapper for native Android distribution

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router, TypeScript) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + custom design tokens |
| **Animation** | [Framer Motion](https://www.framer.com/motion) |
| **Backend** | [Supabase](https://supabase.com) (PostgreSQL, Auth, RLS) |
| **Rate Limiting** | Upstash Redis (optional, graceful fallback) |
| **Hosting** | [Vercel](https://vercel.com) |
| **PWA** | Custom service worker + Web App Manifest |
| **Android** | [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) TWA |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/focusflow-ai.git
cd focusflow-ai
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Run the migrations in order:
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_rls_policies.sql`
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** from Project Settings → API

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
vercel --prod
```

Don't forget to add your environment variables in the Vercel dashboard.

---

## 📱 Play Store Deployment

FocusFlow is built as a **Progressive Web App (PWA)** and wrapped as a **Trusted Web Activity (TWA)** for the Google Play Store.

### Quick Start

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA from your live PWA
bubblewrap init --manifest=https://yourdomain.com/manifest.json

# Build the Android App Bundle
bubblewrap build
```

Upload `app-release-signed.aab` to [Google Play Console](https://play.google.com/console).

**Full step-by-step guide:** [`PLAYSTORE_LAUNCH_GUIDE.md`](./PLAYSTORE_LAUNCH_GUIDE.md)

---

## 📁 Project Structure

```
focusflow-ai/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (tasks, habits, focus, auth, waitlist)
│   ├── auth/callback/      # OAuth callback handler
│   ├── dashboard/          # App home screen
│   ├── focus/              # Pomodoro timer page
│   ├── tasks/              # Task manager page
│   ├── habits/             # Habit tracker page
│   ├── login/              # Authentication UI
│   └── page.tsx            # Marketing landing page
├── components/
│   ├── app/                # App shell (nav, timer, lists, insights)
│   ├── sections/           # Landing page sections (Hero, Features, CTA)
│   └── providers/          # Supabase + PWA providers
├── lib/
│   ├── supabase/           # Server, client & admin clients
│   ├── env.ts              # Zod-validated environment variables
│   └── ratelimit.ts        # Upstash Redis rate limiters
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Custom service worker
│   └── assetlinks.json     # TWA verification
├── supabase/migrations/    # Database schema + RLS policies
└── types/database.ts       # Typed Supabase schema
```

---

## 🔒 Security

- **Row Level Security (RLS)** on every table — users can only read/write their own data
- **Zod validation** on all API inputs
- **Rate limiting** per-IP via Upstash Redis (with offline fallback)
- **Security headers** on every response (CSP, HSTS, X-Frame-Options)
- **SHA-256 IP hashing** for GDPR-compliant analytics

---

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run analyze` | Bundle analysis with `@next/bundle-analyzer` |

---

## 🤝 Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](./LICENSE) © FocusFlow AI

---

<p align="center">
  <sub>Built with ❤️ for deep work and daily momentum.</sub>
</p>
