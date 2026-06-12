# Project Architecture Map

## Purpose
This project is a bilingual (Ukrainian/English) website for a medical center. It provides information about the clinic, doctors, services, news, and contacts.

## Tech Stack
- **Framework:** Next.js (App Router, v14/15+) with Turbopack.
- **Language:** TypeScript (Strict typing).
- **Styling:** Tailwind CSS (with `dark:` variant support).
- **Animations:** Framer Motion (`motion`, `AnimatePresence`, `Variants`).
- **Icons:** Lucide React.
- **Data Source:** Local static data files instead of a database (e.g., `app/data/news.ts`).

## Core Architecture
- **Routing:** Manual routing for i18n without third-party libraries (e.g., `next-intl`).
  - Ukrainian (Default): Handled in root `app/`.
  - English: Handled in `app/en/`.
  - Duplicate components are used for content and static layout translations (e.g., `Header.tsx` and `HeaderEn.tsx`).
  - SEO mapping via `alternates` (canonical, hreflang) in `layout.tsx`.
- **Component Strategy:** Server Components by default. `"use client"` is explicitly added only when interactivity (hooks, Framer Motion) is required.

## Directory Structure
- `/app/` - Next.js App Router root (Ukrainian version).
  - `/app/en/` - English version pages.
  - `/app/components/` - Shared UI components (often paired, e.g., Component and ComponentEn).
  - `/app/data/` - Static JSON-like data representing database entries (e.g., news, team).
  - `/app/api/` - Backend API routes (e.g., `app/api/send/route.ts`).
- `/public/` - Static assets, heavily filtered from AI context (images, PDFs, SVGs).

## Coding Conventions
- **Styling:** Use Tailwind CSS utility classes exclusively. Ensure mobile-first approach and dark mode support.
- **Types:** Rely heavily on TypeScript interfaces. Avoid `any`.