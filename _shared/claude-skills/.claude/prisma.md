---
name: prisma
description: Prisma ORM development skill. Covers schema design, migrations, client usage, relations, type-safe queries, and integration with Next.js. Emphasizes type safety and optimal query patterns.
user-invocable: true
---

# Prisma Development Skill

## What this Skill is for

Use this Skill when the user asks for:

- Database schema design with Prisma
- Migrations and schema changes
- Type-safe database queries
- Relations and nested queries
- Prisma Client usage patterns
- Performance optimization

## Default stack decisions (opinionated)

1. **Type safety first**

- Always use generated Prisma Client types
- Prefer `select` and `include` over fetching all fields
- Use transactions for related operations

2. **Schema conventions**

- Use `@id` with `@default(cuid())` or `@default(uuid())`
- Add `createdAt` and `updatedAt` to all models
- Use explicit relation names for clarity

3. **Client patterns**

- Single Prisma Client instance (singleton pattern)
- Use `$transaction` for atomic operations
- Prefer `findUnique` over `findFirst` when possible

4. **Migrations**

- Always review generated SQL before applying
- Use `prisma db push` for prototyping only
- Use `prisma migrate dev` for proper migrations

## Operating procedure

### 1. Project setup

```bash
npm install prisma -D
npm install @prisma/client
npx prisma init
```

### 2. Schema design (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}
```

### 3. Prisma Client singleton (src/lib/db.ts)

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### 4. Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate
```

### 5. Query patterns

**Basic CRUD:**

```ts
// Create
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John',
  },
});

// Read
const user = await db.user.findUnique({
  where: { id: userId },
});

// Update
const user = await db.user.update({
  where: { id: userId },
  data: { name: 'Jane' },
});

// Delete
await db.user.delete({
  where: { id: userId },
});
```

**With relations:**

```ts
// Include relations
const user = await db.user.findUnique({
  where: { id: userId },
  include: {
    posts: true,
    profile: true,
  },
});

// Select specific fields
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});

// Create with relations
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    profile: {
      create: { bio: 'Hello world' },
    },
  },
  include: { profile: true },
});
```

**Filtering and pagination:**

```ts
const posts = await db.post.findMany({
  where: {
    published: true,
    author: {
      email: { contains: '@example.com' },
    },
  },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
});

// Count
const count = await db.post.count({
  where: { published: true },
});
```

**Transactions:**

```ts
const [user, post] = await db.$transaction([
  db.user.create({ data: { email: 'user@example.com' } }),
  db.post.create({ data: { title: 'Hello', authorId: 'xxx' } }),
]);

// Interactive transaction
await db.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  await tx.post.create({
    data: { title: 'New post', authorId: user.id },
  });
});
```

### 6. Next.js integration

**Server Component:**

```tsx
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: { posts: { take: 5 } },
  });

  return <UserList users={users} />;
}
```

**Server Action:**

```ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;

  await db.post.create({
    data: { title, authorId: 'current-user-id' },
  });

  revalidatePath('/posts');
}
```

**API Route:**

```ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}
```

## Common patterns

**Soft deletes:**

```prisma
model Post {
  id        String    @id @default(cuid())
  deletedAt DateTime?
  // ...
}
```

```ts
// Soft delete
await db.post.update({
  where: { id: postId },
  data: { deletedAt: new Date() },
});

// Query non-deleted
const posts = await db.post.findMany({
  where: { deletedAt: null },
});
```

**Enums:**

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  role Role @default(USER)
}
```

**JSON fields:**

```prisma
model User {
  metadata Json?
}
```

```ts
await db.user.create({
  data: {
    metadata: { preferences: { theme: 'dark' } },
  },
});
```

## CLI commands reference

```bash
npx prisma init              # Initialize Prisma
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Create and apply migration
npx prisma migrate deploy    # Apply migrations (production)
npx prisma migrate reset     # Reset database
npx prisma db push           # Push schema changes (prototyping)
npx prisma db pull           # Pull schema from database
npx prisma studio            # Open Prisma Studio GUI
npx prisma format            # Format schema file
```

## Troubleshooting

- **Client not updated:** Run `npx prisma generate` after schema changes
- **Migration conflicts:** Use `npx prisma migrate reset` in dev
- **Connection issues:** Check DATABASE_URL format and network access
- **Type errors:** Regenerate client and restart TypeScript server
