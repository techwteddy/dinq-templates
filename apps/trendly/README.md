# Trendly

A mobile-first, Instagram-style social app built with **Next.js 15**, **React 19**, **Supabase**, and **Tailwind CSS v4**. Trendly lets users share photo and video posts, browse a vertical Reels feed, publish 24-hour Stories, follow creators, and message friends in real time.

> Built as a full-stack portfolio project to explore the modern Next.js App Router, React Server Components, Server Actions, Row-Level Security, and mobile-first design.

---

## Table of contents

1. [Screenshots](#screenshots)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project structure](#project-structure)
6. [Database schema](#database-schema)
7. [Running locally](#running-locally)
8. [Design decisions](#design-decisions)
9. [What I learned](#what-i-learned)
10. [Roadmap](#roadmap)

---

## Screenshots

Add your own screenshots to `docs/screenshots/` and they will render below.

| Feed | Reels | Stories |
| --- | --- | --- |
| ![Feed](docs/screenshots/feed.png) | ![Reels](docs/screenshots/reels.png) | ![Stories](docs/screenshots/stories.png) |

| Profile | Messages | Compose |
| --- | --- | --- |
| ![Profile](docs/screenshots/profile.png) | ![Messages](docs/screenshots/messages.png) | ![Compose](docs/screenshots/compose.png) |

---

## Features

**Authentication**
- Email + password signup and login
- Forgot password, account switching
- Server-side session handling using httpOnly cookies (no auth tokens in `localStorage`)

**Feed**
- Chronological feed of posts from everyone (placeholder ranking)
- Inline double-tap to like with optimistic UI
- Comments modal loaded on demand
- Share via native Web Share API with clipboard fallback

**Reels (vertical video)**
- Full-screen snap-scrolling viewer
- `IntersectionObserver` automatically plays the active reel and pauses the rest
- Mute / unmute toggle, like / comment / share actions
- Tapping any Discover tile opens the Reels viewer at that post

**Stories**
- 24-hour expiring photos and videos
- YouTube-style trim UI for videos up to 60 seconds
- Follower-only visibility: only the author and their followers see the story ring
- Story ring displayed on profile avatar, post headers, and stories rail

**Profile**
- Own and other users' profiles with post grid, stats, and Edit Profile
- Follow / unfollow with optimistic updates
- Avatar upload via Supabase Storage

**Direct Messages**
- Conversation list with unread badges
- Real-time message delivery via Supabase Realtime
- Optimistic send with rollback on failure

**Other**
- IGTV-style long-form video page
- Discover / search grid with category pills
- Notifications (likes, follows, comments)
- Likes activity screen
- PWA manifest, mobile-first layout, installable on Android / iOS home screen

---

## Tech stack

| Layer | Technology | Why |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router) | Server Components by default reduce client bundle size; Server Actions replace API routes for mutations. |
| UI library | **React 19** | Latest concurrent features (`useActionState`, `useTransition`, `useOptimistic`). |
| Language | **TypeScript 5** | End-to-end type safety including generated Supabase types. |
| Styling | **Tailwind CSS v4** | Utility-first, zero runtime, consistent design tokens via CSS variables. |
| Backend | **Supabase** | Postgres + Auth + Storage + Realtime in one managed service. |
| Database | **Postgres 17** | Row-Level Security policies enforce auth on every query. |
| Icons | **lucide-react** | Tree-shakeable, consistent stroke widths. |
| Deploy | Firebase App Hosting / Vercel | See `DEPLOY.md` for the deploy runbook. |

---

## Architecture

Trendly uses a **thin-server** architecture: most pages are React Server Components that query Supabase directly, mutations go through Next.js Server Actions, and only highly interactive surfaces (Reels player, Story viewer, comment modal) are client components.

```
Browser
  |
  |  HTML + RSC payload
  v
Next.js 15 (App Router)
  |                     \
  |  Server Actions       \  Server Components
  v                         v
Supabase (Postgres + Auth + Storage + Realtime)
```

**Auth flow**

1. User submits login credentials to a Server Action.
2. Server Action calls `supabase.auth.signInWithPassword`, receives a session, and sets an httpOnly cookie.
3. All future Server Components read the session from the cookie via `createClient()` in `src/lib/supabase/server.ts`.
4. Middleware (`src/middleware.ts`) refreshes expiring sessions and gates private routes.

**Mutation flow (example: like a post)**

1. Client clicks Heart icon -> `useTransition` triggers optimistic state update.
2. `toggleLike` Server Action runs on the server.
3. The action checks auth, inserts / deletes a row in `likes`, and calls `revalidatePath`.
4. If the action fails, the optimistic state rolls back.

**Storage**

Three Supabase Storage buckets with RLS policies:
- `avatars` - public read, owner-only write
- `posts` - public read, owner-only write
- `stories` - authenticated read, owner-only write, 24h lifecycle rule

---

## Project structure

```
src/
  app/
    (auth)/          # login, signup, forgot password (public routes)
    (app)/           # feed, reels, profile, messages, stories (authenticated)
      feed/          # main feed + stories rail
      reels/         # vertical reels viewer
      stories/       # story viewer + composer with trimmer
      messages/      # DM list and realtime threads
      profile/       # own profile + edit + menu
      u/[username]/  # other users' profiles
      search/        # discover grid + picks
    actions.ts       # all Server Actions (like, comment, follow, post...)
    layout.tsx       # root layout + metadata + PWA manifest link
    sitemap.ts       # auto-generated /sitemap.xml for SEO
    robots.ts        # auto-generated /robots.txt
  components/        # reusable client components
    ReelsFeed.tsx    # vertical snap-scroll reels viewer
    StoryViewer.tsx  # fullscreen story player with progress bars
    PostCard.tsx     # feed post with like/comment/share
    ChatThread.tsx   # realtime DM thread
    ...
  lib/
    supabase/        # typed client helpers (browser + server)
    stories.ts       # story visibility helpers
    utils.ts         # formatCount, cn, date helpers
    database.types.ts# generated Supabase types
public/
  manifest.json      # PWA manifest
apphosting.yaml      # Firebase App Hosting config
DEPLOY.md            # deployment runbook
```

---

## Database schema

The Postgres schema has 8 tables, every one protected by Row-Level Security:

| Table | Purpose |
| --- | --- |
| `profiles` | One row per user, created via auth trigger. Stores username, bio, avatar_url. |
| `posts` | Photo and video posts with `media_type` column. |
| `stories` | 24h expiring media with `expires_at` column and cleanup cron. |
| `likes` | Composite key (user_id, post_id). |
| `comments` | Threaded comments on posts. |
| `follows` | Composite key (follower_id, following_id). |
| `messages` | Direct messages with `read_at` timestamp; subscribed to via Realtime. |
| `notifications` | Fan-out table populated by triggers on likes / follows / comments. |

TypeScript types are generated from the live schema:

```bash
npx supabase gen types typescript --project-id <project-ref> > src/lib/database.types.ts
```

---

## Running locally

**Prerequisites**
- Node.js 20+
- A Supabase project (free tier is plenty)

**Setup**

```bash
git clone https://github.com/<your-username>/trendly.git
cd trendly
npm install
```

**Environment**

Copy the example env file and paste your Supabase URL and anon key:

```bash
cp .env.local.example .env.local
```

Open `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**Database**

Run the SQL migrations in `supabase/migrations/` (or create the tables manually in the Supabase dashboard using the schema in the Database Schema section above). Then create the three storage buckets: `avatars`, `posts`, `stories`.

**Start the dev server**

```bash
npm run dev
```

Open http://localhost:3000. You will be redirected to `/login`. Create an account - a Postgres trigger auto-creates your `profiles` row.

---

## Design decisions

**Why Next.js App Router over Pages Router?**
Server Components let me query Supabase directly in the page file with zero client-side JavaScript for read-heavy surfaces like the feed and profile. The Reels viewer still ships as a client component because it needs `IntersectionObserver` and video refs.

**Why Supabase over a custom Node backend?**
RLS policies enforce auth rules inside the database itself - I cannot accidentally ship an endpoint that leaks data because the query just returns empty rows if the policy fails. That is a stronger guarantee than app-level auth checks.

**Why Server Actions over REST / tRPC?**
Every mutation in Trendly is called from exactly one place in the UI. REST is overkill, and Server Actions give me end-to-end type safety without a code-generation step. `revalidatePath` handles cache invalidation for free.

**Why a mobile-first `phone` wrapper?**
The app is designed to feel like a native mobile experience even on desktop. The `.phone` class in `globals.css` caps the width at 420px and centers content on wide screens - a lightweight way to keep the UI consistent without shipping a React Native app.

**Why MediaRecorder + media-fragment fallback for story trimming?**
Chrome on Android supports `captureStream()` and `MediaRecorder` for true client-side video clipping. iOS Safari does not. The fallback uploads the original file with a `#t=start,end` media fragment so the browser seeks to the trimmed range on playback. It is not true trimming but it works everywhere.

---

## What I learned

- **React Server Components force you to think about data dependencies upfront.** Instead of fetching in `useEffect`, I query in the page file and prop-drill down.
- **Row-Level Security changes how you think about auth.** I stopped writing "if user.id === post.user_id" guards in my app code once I had the policies right.
- **Optimistic UI is a huge UX win.** Likes, follows, and comments feel instant because the UI updates before the server responds.
- **`IntersectionObserver` is the right tool for auto-playing the visible reel** - simpler and more reliable than scroll listeners.
- **Tailwind v4's CSS variable theme** made it trivial to swap brand colors (the story ring went from Instagram's gradient to solid red with a one-line change).

---

## Roadmap

- [ ] Real ranking algorithm for the feed (engagement + recency)
- [ ] Push notifications via Firebase Cloud Messaging
- [ ] Video transcoding for smaller upload sizes
- [ ] Android wrapper via Bubblewrap TWA for Play Store listing
- [ ] End-to-end encryption on Direct Messages
- [ ] Close Friends list for restricted stories

---

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.

---

Built by **Siddharth Mishra** - [GitHub](https://github.com/siddharth99-java)
