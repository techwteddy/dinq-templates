# HabitSmith

HabitSmith is a modern SaaS-style habit tracking app focused on productivity, streak momentum, analytics clarity, and social accountability.

It is built frontend-first with a repository/service architecture so mock data can be swapped for Supabase and Stripe with minimal refactoring.

## Features

- Auth flow: landing, login, signup, forgot password, protected dashboard routes
- Onboarding flow: goals, starter habits, reminder preferences
- Dashboard: today habits, streak summary, progress bars, weekly/monthly charts, activity, leaderboard preview, premium upgrade card
- Habits management: create/edit/archive/delete habits, category filtering, completion actions, habit stats, details panel
- Analytics workspace: completion trends, streak trends, category distribution, consistency insights, strongest/weakest habits
- Social features: friend search, follow users, activity feed, leaderboard, public profile route (`/u/[username]`)
- Profile and settings: editable profile, theme/privacy/notification preferences, billing section, danger zone
- Pricing and monetisation scaffold: Free vs Premium cards, mocked checkout flow
- Supabase and Stripe stubs: env placeholders, client bootstraps, repository stubs

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Zustand
- React Hook Form + Zod
- date-fns
- Recharts
- Lucide React
- Supabase JS (prepared)
- Stripe SDK (prepared)

## Architecture Overview

Core principles:

- Pages call services, not repositories directly.
- Repositories are interface-driven and swappable (mock vs Supabase).
- Domain models are centralized in `src/types`.
- Streak calculations are pure functions in `src/lib/date/streak-utils.ts`.

### Folder Structure

```text
src/
  app/
  components/
    ui/
    layout/
    dashboard/
    habits/
    analytics/
    social/
    billing/
    auth/
    shared/
  features/
    auth/
    habits/
    analytics/
    social/
    billing/
    profile/
  services/
  repositories/
    interfaces/
    mock/
    supabase/
  stores/
  hooks/
  types/
  lib/
    utils/
    validations/
    date/
    constants/
    env/
  config/
```

## Frontend-First Data Strategy

- `repositories/interfaces/*`: data contracts for auth, habits, analytics, social, billing, profile
- `repositories/mock/*`: in-memory realistic data providers used by the app today
- `repositories/supabase/*`: future implementation stubs for live backend
- `services/*`: business logic abstraction consumed by pages/components

## Mock Data Used Today

`src/lib/constants/mock-data.ts` seeds:

- one test user/profile
- multiple habits with varied frequencies
- habit logs across recent weeks
- social graph, activity feed, leaderboard
- subscription plans and current subscription

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 3. Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Supabase Integration Plan

1. Implement repository methods in `src/repositories/supabase/*`.
2. Replace `mockRepositories` binding in `src/services/index.ts` with Supabase repositories.
3. Map domain models to Supabase tables:
   - `profiles`, `habits`, `habit_logs`, `friends`, `subscriptions`.
4. Move auth methods to Supabase Auth (`signInWithPassword`, `signUp`, password reset).
5. Add RLS policies for user-owned rows and social visibility constraints.

## Stripe Integration Plan

1. Create API route handlers for checkout/session lifecycle.
2. Use `src/lib/utils/stripe-client.ts` for server-side Stripe client initialization.
3. Replace mocked `createCheckoutSession` and `cancelSubscription` with Stripe calls.
4. Process webhooks (`checkout.session.completed`, `customer.subscription.updated`) to sync subscription state.
5. Persist subscription status in backend table and expose through billing repository.

## Accessibility + UX Notes

- Keyboard-focusable controls across forms and dashboards
- Labelled inputs for auth, onboarding, habit and profile forms
- Responsive layouts across mobile and desktop

## Screenshots

- Add dashboard screenshot
- Add habits management screenshot
- Add analytics screenshot
- Add pricing screenshot

## Future Roadmap

- Real-time updates via Supabase subscriptions
- Habit reminders and notification scheduling
- Accountability groups and social challenges
- Team workspaces and invite system
- Exportable reports and AI coaching insights
