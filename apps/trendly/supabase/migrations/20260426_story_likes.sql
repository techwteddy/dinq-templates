-- =========================================================================
-- Story Likes
-- =========================================================================
-- Lets viewers tap a heart on someone's story. Author sees the count.
-- Mirrors the (post-)likes table shape for consistency.
-- =========================================================================

create table if not exists public.story_likes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (story_id, user_id)
);

-- Indexes for the hot read paths.
create index if not exists story_likes_story_idx
  on public.story_likes (story_id);
create index if not exists story_likes_user_idx
  on public.story_likes (user_id);

-- Row-level security: anyone signed in can read (so viewers + author both can
-- see counts), but you can only insert/delete your own like.
alter table public.story_likes enable row level security;

drop policy if exists "story_likes_select" on public.story_likes;
create policy "story_likes_select"
  on public.story_likes
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "story_likes_insert_own" on public.story_likes;
create policy "story_likes_insert_own"
  on public.story_likes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "story_likes_delete_own" on public.story_likes;
create policy "story_likes_delete_own"
  on public.story_likes
  for delete
  using (auth.uid() = user_id);
