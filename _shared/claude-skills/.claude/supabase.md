---
name: supabase
description: Supabase development skill. Covers database design, Row Level Security (RLS), Edge Functions, Auth, Storage, Realtime subscriptions, and client SDK usage with TypeScript. Emphasizes security-first patterns and type-safe database access.
user-invocable: true
---

# Supabase Development Skill

## What this Skill is for

Use this Skill when the user asks for:

- Database schema design and migrations
- Row Level Security (RLS) policies
- Authentication and authorization
- Edge Functions (Deno)
- Storage bucket configuration
- Realtime subscriptions
- Type generation and client SDK usage

## Default stack decisions (opinionated)

1. **Security first**

- Always enable RLS on tables
- Write explicit policies, never rely on defaults
- Use service role only in server-side code

2. **Type safety**

- Generate types from database schema
- Use typed Supabase client everywhere
- Validate inputs at API boundaries

3. **Auth patterns**

- Prefer Supabase Auth over custom auth
- Use RLS policies tied to `auth.uid()`
- Handle auth state with React context/hooks

4. **Database design**

- Use UUIDs for primary keys
- Add `created_at` and `updated_at` timestamps
- Use foreign keys with appropriate ON DELETE behavior

## Operating procedure

### 1. Project setup

```bash
# Install CLI
npm install supabase -D

# Initialize
npx supabase init

# Start local development
npx supabase start

# Generate types
npx supabase gen types typescript --local > src/types/database.ts
```

### 2. Client setup

Install SDK:

```bash
npm install @supabase/supabase-js
```

Create typed client (`src/lib/supabase.ts`):

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

Server-side client (for API routes/server components):

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
```

### 3. Database migrations

Create migration:

```bash
npx supabase migration new create_users_table
```

Example migration (`supabase/migrations/xxx_create_users_table.sql`):

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Apply migrations:

```bash
npx supabase db push  # Local
npx supabase db push --linked  # Remote
```

### 4. Row Level Security patterns

**Public read, authenticated write:**

```sql
CREATE POLICY "Anyone can read"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON public.posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);
```

**Team-based access:**

```sql
CREATE POLICY "Team members can access"
  ON public.team_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_resources.team_id
      AND team_members.user_id = auth.uid()
    )
  );
```

### 5. Authentication

React hook usage:

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### 6. Realtime subscriptions

```tsx
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 7. Edge Functions

Create function:

```bash
npx supabase functions new my-function
```

Example function (`supabase/functions/my-function/index.ts`):

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase.from('users').select('*');

  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

Deploy:

```bash
npx supabase functions deploy my-function
```

### 8. Storage

```ts
// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.png`);

// Download
const { data, error } = await supabase.storage
  .from('avatars')
  .download(`${userId}/avatar.png`);
```

Storage policies (in SQL):

```sql
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Common queries

```ts
// Select with relations
const { data } = await supabase
  .from('posts')
  .select('*, author:users(name, avatar_url)')
  .eq('published', true)
  .order('created_at', { ascending: false });

// Insert
const { data, error } = await supabase
  .from('posts')
  .insert({ title, content, user_id: user.id })
  .select()
  .single();

// Update
const { error } = await supabase
  .from('posts')
  .update({ title })
  .eq('id', postId);

// Delete
const { error } = await supabase.from('posts').delete().eq('id', postId);

// RPC (stored procedure)
const { data } = await supabase.rpc('get_user_stats', { user_id: userId });
```

## CLI commands reference

```bash
npx supabase start          # Start local containers
npx supabase stop           # Stop local containers
npx supabase db reset       # Reset local database
npx supabase db push        # Apply migrations
npx supabase gen types typescript --local  # Generate types
npx supabase functions serve  # Run edge functions locally
npx supabase link           # Link to remote project
```
