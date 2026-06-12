# Finance Dashboard

A self-hostable personal finance dashboard. Track accounts, income and expenses, recurring transactions, and a 90-day cash flow projection. Bring your own Supabase project, run the migrations, and you have a private dashboard for your own data.

Built with **Next.js 16 (App Router) + React 19**, **Supabase** (Postgres + Auth + RLS), **Tailwind CSS v4**, and **Recharts**.

> This is a template/portfolio project. Clone it, connect your own database, and use it.

## Features

- **Overview** with KPIs (total balance, monthly income/expenses, estimated runway) and an income vs. expenses chart.
- **Income & Expenses** with search, status filters, and inline create/edit.
- **Accounts** (checking, savings, credit card, cash, investment) with auto-calculated balances.
- **Categories** with custom colors and icons.
- **Recurring transactions** that generate the next entry on demand.
- **Cash flow** 90-day projection with a running-balance line.
- **Auth**: Google OAuth + mandatory TOTP MFA, gated by an email allowlist.
- **Row Level Security** on every table, dark mode, and a configurable currency/locale.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | React 19, Tailwind CSS v4, Radix primitives, Recharts |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Validation | Zod |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/NikolasRaposo/finance-dashboard.git
cd finance-dashboard
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then apply the schema. Using the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or paste `supabase/migrations/0001_init.sql` (and optionally `0002_seed_demo.sql` for sample data) into the SQL editor.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your project's API settings. Optionally set `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_LOCALE`, and `NEXT_PUBLIC_CURRENCY`.

### 4. Enable Google sign-in

In the Supabase dashboard, go to **Authentication → Providers → Google** and enable it with your OAuth credentials. Add `http://localhost:3000/auth/callback` (and your production URL) to the allowed redirect URLs.

### 5. Allow your email

Signups are gated by the `allowed_emails` table. Add your address as admin **before** signing in:

```sql
insert into public.allowed_emails (email, role) values ('you@example.com', 'admin');
```

(The demo seed inserts a placeholder you can edit.)

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and set up MFA on first login.

## Deploy

Works on any Node host. On **Vercel**, import the repo and set the environment variables. On **Cloudflare Workers**, use [OpenNext](https://opennext.js.org/cloudflare). Remember to add your production `/auth/callback` URL to Supabase's allowed redirects.

## Configuration notes

- **Currency & locale** are read from env at build time (`NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_LOCALE`) and applied via `Intl`.
- **MFA is enforced** by `proxy.ts` for every authenticated route. New users are pushed to enroll a TOTP factor.
- **Types** in `types/database.ts` are hand-written. Once connected, you can regenerate them with `supabase gen types typescript`.

## License

[MIT](./LICENSE)
