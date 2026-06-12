# ADR 001 — Use Next.js 15 with App Router

**Date:** 2025-01-01  
**Status:** Accepted

---

## Context

The portfolio needs SSR/SSG, image optimization, font loading without layout shift, and a simple deployment story. Two options were considered: Next.js (App Router), and a plain React SPA (Vite + React).

## Decision

Use **Next.js 15 with the App Router**.

## Reasons

- **App Router** is the current Next.js standard. Pages Router is in maintenance mode.
- `next/image` handles WebP conversion, lazy loading, and remote pattern allowlisting — no extra config.
- `next/font` (Geist) eliminates FOUT (Flash of Unstyled Text) with zero-config font optimization.
- Static export + Vercel gives free, zero-config deployments with preview URLs per PR.
- The `layout.tsx` / `page.tsx` convention makes the metadata, fonts, and global styles obvious and centralized.

## Consequences

- All new pages and routes must live under `src/app/`, not `src/pages/`.
- Server Components are the default. Add `"use client"` only when browser APIs or React state/effects are needed.
- Do not mix App Router and Pages Router. The `pages/` directory must not be created.
