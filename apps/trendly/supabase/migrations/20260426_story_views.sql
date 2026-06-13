-- =========================================================================
-- Story view tracking
-- =========================================================================
-- Marks stories as "seen" by each viewer so the feed can flip the avatar
-- story ring from colored to grey once everything's been watched.
-- =========================================================================

create table if not exists public.story_views (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer_id uuid not null references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (story_id, viewer_id)
);

create index if not exists story_views_viewer_idx
  on public.story_views (viewer_id);
create index if not exists story_views_story_idx
  on public.story_views (story_id);

alter table public.story_views enable row level security;

drop policy if exists "story_views_select" on public.story_views;
create policy "story_views_select"
  on public.story_views
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "story_views_insert_own" on public.story_views;
create policy "story_views_insert_own"
  on public.story_views
  for insert
  with check (auth.uid() = viewer_id);
