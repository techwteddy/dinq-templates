-- =========================================================================
-- Post archiving
-- =========================================================================
-- Soft-archive posts so the author can hide them from their public profile
-- + feed without losing the record. Archived posts remain visible to the
-- author only at /archive, and can be un-archived at any time.
-- =========================================================================

alter table public.posts
  add column if not exists archived_at timestamptz;

-- Partial index — rows with archived_at null are the common hot path
-- (public feed/profile), so keep them fast.
create index if not exists posts_active_user_created_idx
  on public.posts (user_id, created_at desc)
  where archived_at is null;

-- Optional: archived posts by user (for /archive)
create index if not exists posts_archived_user_idx
  on public.posts (user_id, archived_at desc)
  where archived_at is not null;
