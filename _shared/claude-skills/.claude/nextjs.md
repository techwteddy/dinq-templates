---
name: nextjs
description: Next.js 15 development skill. Covers App Router, Server Components, Server Actions, caching, streaming, parallel routes, intercepting routes, and modern React patterns. Emphasizes performance and type safety.
user-invocable: true
---

# Next.js 15 Development Skill

## What this Skill is for

Use this Skill when the user asks for:

- Next.js App Router patterns
- Server Components vs Client Components
- Server Actions and form handling
- Data fetching and caching
- Routing (parallel, intercepting, dynamic)
- Middleware and authentication
- Performance optimization

## Default stack decisions (opinionated)

1. **Server Components first**

- Default to Server Components
- Only add "use client" when necessary (interactivity, hooks, browser APIs)
- Keep Client Components as leaf nodes

2. **Server Actions for mutations**

- Prefer Server Actions over API routes for form submissions
- Use `revalidatePath` / `revalidateTag` for cache invalidation
- Handle errors with try/catch and return error states

3. **Streaming and Suspense**

- Use `loading.tsx` for route-level loading states
- Use `<Suspense>` for component-level streaming
- Leverage parallel data fetching

4. **Type safety**

- Use TypeScript strictly
- Type params and searchParams properly
- Use zod for runtime validation

## Operating procedure

### 1. Project structure (App Router)

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── not-found.tsx       # 404 UI
├── (auth)/             # Route group (no URL impact)
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx      # Nested layout
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
├── posts/
│   ├── page.tsx        # /posts
│   └── [id]/           # Dynamic route
│       └── page.tsx    # /posts/123
└── api/
    └── webhooks/
        └── route.ts    # API route
```

### 2. Server Components (default)

```tsx
// app/posts/page.tsx
import { db } from '@/lib/db';

export default async function PostsPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

### 3. Client Components (when needed)

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**When to use "use client":**

- useState, useEffect, useContext, custom hooks
- Event handlers (onClick, onChange, etc.)
- Browser-only APIs (localStorage, window, etc.)
- Third-party libraries that use React state

### 4. Server Actions

```tsx
// app/posts/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().optional(),
});

export async function createPost(formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { error: 'Invalid data' };
  }

  await db.post.create({
    data: parsed.data,
  });

  revalidatePath('/posts');
  redirect('/posts');
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
}
```

**Using in forms:**

```tsx
// app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

**With useActionState (React 19):**

```tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '../actions';

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" disabled={isPending} />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 5. Dynamic routes and params

```tsx
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) notFound();

  return <article>{post.title}</article>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { id: true } });
  return posts.map((post) => ({ id: post.id }));
}
```

### 6. Search params

```tsx
// app/posts/page.tsx
type Props = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function PostsPage({ searchParams }: Props) {
  const { page = '1', search = '' } = await searchParams;
  const pageNum = parseInt(page);

  const posts = await db.post.findMany({
    where: search ? { title: { contains: search } } : undefined,
    skip: (pageNum - 1) * 10,
    take: 10,
  });

  return <PostList posts={posts} />;
}
```

### 7. Layouts and templates

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### 8. Loading and error states

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <PostsSkeleton />;
}

// app/posts/error.tsx
('use client');

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 9. Parallel routes

```
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @team/
        └── page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

### 10. Middleware

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### 11. Metadata and SEO

```tsx
// app/posts/[id]/page.tsx
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });

  return {
    title: post?.title ?? 'Post',
    description: post?.content?.slice(0, 160),
  };
}
```

### 12. API routes (when needed)

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');

  const posts = await db.post.findMany({
    skip: (page - 1) * 10,
    take: 10,
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}
```

## Caching strategies

```tsx
// Force dynamic (no cache)
export const dynamic = 'force-dynamic';

// Revalidate every 60 seconds
export const revalidate = 60;

// Cache with tags
import { unstable_cache } from 'next/cache';

const getPost = unstable_cache(
  async (id: string) => db.post.findUnique({ where: { id } }),
  ['post'],
  { tags: ['posts'], revalidate: 3600 },
);
```

## Common patterns

**Optimistic updates:**

```tsx
'use client';

import { useOptimistic } from 'react';

export function LikeButton({ likes, postId }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state) => state + 1,
  );

  return (
    <form
      action={async () => {
        addOptimisticLike(null);
        await likePost(postId);
      }}
    >
      <button>{optimisticLikes}</button>
    </form>
  );
}
```

**Streaming with Suspense:**

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
    </main>
  );
}
```
