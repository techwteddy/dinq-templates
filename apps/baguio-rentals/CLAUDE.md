@AGENTS.md

# Property Rentals Baguio City

Rental listings platform for Baguio City. Free tier, monetization-ready.

## Stack
- Next.js 15 (App Router, Server Components, Server Actions)
- Supabase (Auth, PostgreSQL, Storage, Realtime)
- Leaflet + OpenStreetMap (maps, free)
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline`)
- TypeScript
- Deployed on Vercel (hobby tier)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Architecture
- Server Components by default, `'use client'` only for interactivity
- Server Actions for all mutations (no API routes for CRUD)
- Supabase SSR pattern with `@supabase/ssr` (cookie-based sessions)
- RLS enforced on all tables
- Full-text search via PostgreSQL tsvector
- `loading.tsx` skeletons on all major routes for instant navigation feedback

## Auth
- Google + Facebook OAuth only (no email/password)
- Two roles: property_owner, renter
- Role selected during onboarding after first sign-in
- After auth callback and onboarding, users redirect to homepage (`/`)

## Roles & Permissions
- Both roles can browse listings, save favorites, send messages, and leave reviews
- Reviews are gated: users must have an existing conversation before reviewing each other
- No self-reviews allowed (enforced in server action + RLS)
- Occupied listings hidden from browse page but visible in Saved
- Property owners manage availability (available/reserved/occupied) on `/my-listings`

## Routes
- `/` — homepage with hero + featured listings
- `/listings` — browse with filters, search, sort
- `/listings/[id]` — listing detail (gallery, map, owner card, message button)
- `/listings/new` — create listing (owners only)
- `/listings/[id]/edit` — edit listing (owners only)
- `/my-listings` — owner's listing management with stats + availability toggles
- `/saved` — saved/favorited listings (all users)
- `/messages` — conversation list (sidebar + chat split-pane layout)
- `/messages/[conversationId]` — chat thread
- `/profile/[id]` — public profile with reviews, edit form (own profile only)
- `/onboarding` — role selection after first sign-in

## Key Directories
- `src/app/` — pages, server actions, loading skeletons
- `src/components/auth/` — AuthButton (profile dropdown with click-outside close)
- `src/components/layout/` — Navbar, Footer, MobileMenu (full-screen portal), NavLink (active indicator), Skeleton
- `src/components/listings/` — ListingCard, ListingForm, ListingFilters, AvailabilityBadge, AvailabilityToggle, FavoriteButton, ImageUploader
- `src/components/messages/` — ChatThread, ConversationList, MessagesBadge (icon + nav variants)
- `src/components/profile/` — EditProfileForm
- `src/components/reviews/` — ReviewForm, ReviewList, StarRating
- `src/lib/supabase/` — client.ts (browser), server.ts (server)
- `src/lib/types/` — TypeScript types (database.ts)
- `src/lib/utils/` — constants, formatters
- `supabase/migrations/` — database migrations

## Design System
- **Theme**: "Pine Lodge" — earthy/natural palette
- **Colors**: pine (dark green), amber (gold), bark (brown text), cream (background), mist (light bg), stone (borders), warm-white (card bg)
- **Fonts**: DM Serif Display (headings), Plus Jakarta Sans (body) — loaded via `<link>` in layout.tsx
- **Status colors**: green (available), amber (reserved), red (occupied) — used on badges, cards, stats

## Supabase Realtime
- Tables must be added to `supabase_realtime` publication: `ALTER PUBLICATION supabase_realtime ADD TABLE <table>`
- `REPLICA IDENTITY FULL` required on messages table for UPDATE payloads to include old values (needed for read receipt tracking)
- Use `useMemo(() => createClient(), [])` to prevent subscription teardown on re-renders
- ChatThread skips all realtime messages from current user (optimistic insert handles own messages)
- Mark-as-read triggers only when user types in the message input, not on page load

## Gotchas
- Google avatar URLs (`lh3.googleusercontent.com`) require `referrerPolicy="no-referrer"` on all `<img>` tags
- Navbar uses `backdrop-blur-xl` which creates a stacking context — `fixed` positioned children (dropdowns, overlays) get trapped. Use `createPortal` to document.body for modals/overlays
- MobileMenu uses portal to body for both backdrop and menu panel to escape navbar stacking context
- `scroll-behavior: smooth` must be set via `data-scroll-behavior="smooth"` on `<html>`, not CSS (Next.js 15 requirement)
- Chat scroll uses `scrollTop = scrollHeight` on the overflow container, not `scrollIntoView` (which scrolls the entire page)
- Footer hidden on mobile for task-focused pages (messages, saved, my-listings) via layout-level `<style>` targeting `#site-footer`
