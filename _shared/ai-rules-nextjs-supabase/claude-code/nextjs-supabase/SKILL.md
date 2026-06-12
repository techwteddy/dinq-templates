---
name: nextjs-supabase
description: Lite conventions for Next.js 15+, Tailwind CSS v4, and Supabase. Use when generating pages, route handlers, Server Actions, forms, middleware, or auth flows in this stack.
---

# Next.js / Tailwind / Supabase Lite

## Core defaults

- Server Components by default. Add `"use client"` only for hooks, browser APIs, or event handlers.
- Use TypeScript strict mode. Never use `any`.
- Validate external inputs with Zod.
- Prefer named exports, except where Next.js requires a default export.
- Generate final code directly without long narration.

## Project structure

Use this structure unless the user says otherwise:

```text
src/
  app/
    (auth)/
    (dashboard)/
    api/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
    global.css
  actions/
  components/
    ui/
    forms/
    [feature]/
  hooks/
  lib/
    supabase/
      client.ts
      server.ts
      types.ts
    utils.ts
    validations.ts
  types/
    index.ts
  middleware.ts
```

## Next.js rules

- Always use the App Router.
- In Next.js 15+, type `params` and `searchParams` as `Promise<...>` and await them.
- Static pages should export `metadata` when relevant.
- Dynamic pages should export `generateMetadata` and call `notFound()` when the record does not exist.
- Any route segment that fetches data should have colocated `loading.tsx` and `error.tsx`.

## Data fetching

- Fetch initial page data in Server Components with `async/await`.
- Do not use `useEffect` for first-load page data.
- Use `createServerClient()` from `@/lib/supabase/server` in Server Components, Route Handlers, and Server Actions.
- Use `createClient()` from `@/lib/supabase/client` only in browser code.
- Always destructure `{ data, error }` and handle the error.
- Always select explicit columns. Never use `select('*')`.
- Use `.maybeSingle()` for 0-or-1 rows and `.single()` only when absence is exceptional.

## Route Handlers and Server Actions

- Route Handlers live in `src/app/api/**/route.ts`.
- Use `NextRequest` and `NextResponse` from `next/server`.
- Return JSON with `NextResponse.json()`.
- Validate POST, PUT, and PATCH bodies with Zod before writing.
- In server code, use `supabase.auth.getUser()`, never `getSession()`.
- Server Action files start with `'use server'`.
- After mutations, call `revalidatePath()` or `revalidateTag()`.
- If an action will be used with `useActionState`, use the signature `(prevState, formData)`.

## Forms

- Use `useActionState` from React 19, never `useFormState`.
- Show field-level errors under the matching input.
- Show a pending state on the submit button.
- Use proper `<label htmlFor="...">`.
- Reuse `src/components/ui/Button.tsx` if it already exists.

## Tailwind and Supabase essentials

- Tailwind v4 uses `@import 'tailwindcss'` and `@theme` in `src/app/global.css`.
- Use `cn()` for conditional classes and avoid inline styles.
- Keep browser and server Supabase clients separate.
- In middleware, use `createServerClient` from `@supabase/ssr` with the `getAll()` / `setAll()` cookie bridge.
- Redirect unauthenticated users from `/dashboard` to `/login`.
- Redirect authenticated users from `/login` or `/signup` to `/dashboard`.
