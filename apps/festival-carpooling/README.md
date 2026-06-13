# Carpooling

A self-hosted, festival-focused carpooling Progressive Web App. Drivers post rides, passengers request seats, and the platform tracks CO₂ savings for the whole community.

Built with Next.js 16, Supabase, and Tailwind CSS. Deployable to Vercel in minutes.

---

## What it does

| Feature | Description |
|---------|-------------|
| **Ride board** | Browse all available rides filtered by origin, date, or trip type (one-way / return) |
| **Post a ride** | Drivers publish departure city, time, seats, optional fuel contribution and stops |
| **Request a seat** | Passengers send a request with an optional message — no account required to browse |
| **Driver dashboard** | Accept or decline requests via a private link sent by email (no login needed) |
| **CO₂ tracking** | Estimates kg of CO₂ avoided per trip based on a configurable emission factor |
| **Festival countdown** | Countdown timer to the active festival's start date |
| **Announcements** | Pinned and regular announcements from the organiser, displayed as a carousel |
| **Admin panel** | Create/manage announcements and view reported rides (`/admin`, requires `is_admin = true`) |
| **PWA** | Installable on mobile, works offline for cached pages |

The app is designed around a single *active* festival at a time, configurable entirely through the database.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19 · Tailwind CSS 3 · custom design system |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Row-Level Security) |
| Auth | Supabase Auth (magic link / OAuth) |
| Email | Nodemailer via any SMTP provider (Gmail, Brevo, etc.) |
| Validation | [Zod](https://zod.dev) |
| Deployment | [Vercel](https://vercel.com) (or any Node.js host) |
| Language | TypeScript (strict) |

---

## Prerequisites

- **Node.js** ≥ 18.17 — check with `node -v`
- **npm** ≥ 10 — check with `npm -v`
- A **Supabase** project (free tier is enough) — [create one here](https://supabase.com/dashboard)
- An **SMTP account** for email notifications (optional but recommended — e.g. Gmail App Password or Brevo)

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/itscharbel/carpooling.git
cd carpooling
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com/dashboard)
2. Open the **SQL Editor** and run the migration files in order:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_rls.sql
supabase/migrations/003_functions.sql
supabase/migrations/004_auth_removal.sql
supabase/migrations/005_add_stops.sql
```

3. (Optional) Run `supabase/seed.sql` to insert a demo festival and sample announcements.

> **Tip:** You can also use the [Supabase CLI](https://supabase.com/docs/guides/cli) to apply migrations locally with `supabase db push`.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values — see the [Environment variables](#environment-variables) section below for details.

### 5. Add your festival to the database

Insert a row into the `festivals` table:

```sql
insert into public.festivals (name, slug, location, starts_at, ends_at, is_active)
values ('Your Festival 2026', 'your-festival-2026', 'City, Country', '2026-07-01', '2026-07-05', true);
```

Or set `FESTIVAL_SLUG=your-festival-2026` in `.env.local` to pin a specific festival by slug (useful if you have multiple rows).

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in each value.

### Supabase

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL — found in Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon/public key — safe to expose in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key — **never expose client-side** |

### App

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | ✅ | Full URL of the app, used in email links (e.g. `https://yourapp.vercel.app`) |
| `FESTIVAL_SLUG` | ❌ | If set, always uses this festival slug. If unset, uses the first `is_active = true` festival |

### Email (SMTP)

Email is used to send drivers a management link when they post a ride. If SMTP is not configured, rides still work — management links are only shown in the server logs.

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_HOST` | ❌ | SMTP server hostname (e.g. `smtp-relay.brevo.com` or `smtp.gmail.com`) |
| `SMTP_PORT` | ❌ | SMTP port — defaults to `587` |
| `BREVO_SMTP_USER` | ❌ | SMTP username / email address |
| `BREVO_SMTP_KEY` | ❌ | SMTP password or app password |
| `BREVO_SENDER_EMAIL` | ❌ | From address shown on outgoing emails |

> **Gmail users:** Enable 2FA on your Google account, then create an [App Password](https://myaccount.google.com/apppasswords) and use `smtp.gmail.com` as `SMTP_HOST`.
>
> **Brevo users:** Use `smtp-relay.brevo.com` as `SMTP_HOST` with your Brevo SMTP credentials.

---

## Development vs production

### Development

```bash
npm run dev        # starts Next.js with Turbopack on http://localhost:3000
npm run typecheck  # TypeScript check without emitting files
npm run lint       # ESLint
```

### Production (Vercel)

```bash
npm run build   # build for production
npm run start   # start the production server locally
```

When deploying to Vercel, add all environment variables under **Project → Settings → Environment Variables**. The app deploys automatically on every push to `main`.

### Production (self-hosted)

Any Node.js 18+ host works. Build and start:

```bash
npm run build
npm run start      # listens on $PORT (default 3000)
```

---

## Database

### Migrations

All schema changes are in `supabase/migrations/` as numbered SQL files. Apply them in order on a fresh Supabase project.

| File | What it does |
|------|-------------|
| `001_schema.sql` | Core tables: festivals, profiles, rides, ride_requests, announcements, reports, app_config |
| `002_rls.sql` | Row-Level Security policies (public read, driver-owns-rides, admin-sees-all) |
| `003_functions.sql` | PostgreSQL RPCs for CO₂ and community stats |
| `004_auth_removal.sql` | Adds `management_token` to rides — drivers manage via email link, no login required |
| `005_add_stops.sql` | Adds `stops` (intermediate stops) column to rides |

### Seed data

`supabase/seed.sql` inserts a placeholder festival and two sample announcements. Edit it before running if you want real data.

### Making a user an admin

After the user signs up, run this in the Supabase SQL Editor:

```sql
update public.profiles
set is_admin = true
where id = '<user-uuid>';
```

The admin panel is then accessible at `/admin`.

---

## Known limitations & TODOs

- **Italian UI only** — all copy, validation messages, and date formatting are in Italian. Internationalisation (i18n) has not been implemented.
- **No rate limiting** — form submissions are not rate-limited at the app level. Consider adding Vercel's WAF rules or a Supabase Edge Function for production use with high traffic.
- **Single active festival** — the app is designed around one festival at a time. Multi-festival support would require adding a festival selector to the UI.
- **No ride search** — rides are filtered client-side; a full-text search (e.g. Supabase `fts`) would improve UX at scale.
- **SMTP is fire-and-forget** — email errors are logged but not retried. A proper queue (e.g. Resend, Loops) would improve reliability.
- **No test suite** — there are no automated tests. Adding Playwright e2e tests for the core booking flow would be a good first contribution.

---

## License

MIT — see [LICENSE](LICENSE).
