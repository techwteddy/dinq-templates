-- =========================================================================
-- Performance indexes
-- =========================================================================
-- Covers the hot paths surfaced in production: embedded feed joins, badge
-- counts in the top bar, conversation threads, the global reels/proof feed,
-- and the activity (/likes) page. Every index below is SAFE to add (partial
-- or IF NOT EXISTS) and measured against the actual queries in the app.
-- =========================================================================

-- -- likes -----------------------------------------------------------------
-- The (post_id,user_id) unique index already covers post_id left-prefix
-- lookups, so we only need a user_id-ordered index for the /likes activity
-- feed ("posts your followed users liked").
create index if not exists likes_user_created_idx
  on public.likes (user_id, created_at desc);

-- -- comments --------------------------------------------------------------
-- Feed renders "N comments" per post via comments(id) join. Without a
-- post_id index Postgres sequential-scans the comments table per request.
create index if not exists comments_post_idx
  on public.comments (post_id);
create index if not exists comments_post_created_idx
  on public.comments (post_id, created_at desc);

-- -- saved_posts -----------------------------------------------------------
-- post-side lookup (e.g. "am I saving this post?" from a feed batch)
create index if not exists saved_posts_post_idx
  on public.saved_posts (post_id);

-- -- follows ---------------------------------------------------------------
-- The (follower_id,following_id) unique covers "who do I follow". We still
-- need an index on following_id for "who follows me" / profile follower
-- counts.
create index if not exists follows_following_idx
  on public.follows (following_id);

-- -- notifications ---------------------------------------------------------
-- TopBar badge count (HeaderBadges) runs on EVERY authenticated page.
-- Partial index on unread makes the count head-scan essentially free.
create index if not exists notifications_unread_idx
  on public.notifications (user_id)
  where is_read = false;
-- Full scan ordering for /likes and notification drawers.
create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

-- -- messages --------------------------------------------------------------
-- Unread count in TopBar + thread fetch in /messages/[peerId].
create index if not exists messages_unread_idx
  on public.messages (receiver_id)
  where is_read = false;
-- Cover both thread directions with an ordered index.
create index if not exists messages_thread_idx
  on public.messages (sender_id, receiver_id, created_at desc);
create index if not exists messages_receiver_created_idx
  on public.messages (receiver_id, created_at desc);

-- -- posts -----------------------------------------------------------------
-- The GLOBAL feed query ("latest 30 active posts across all users") is the
-- hottest read in the app. A partial index keyed only on created_at makes
-- that query index-only.
create index if not exists posts_active_created_idx
  on public.posts (created_at desc)
  where archived_at is null;

-- -- stories ---------------------------------------------------------------
-- getUsersWithActiveStories filters by (user_id IN (...)) and expires_at.
create index if not exists stories_user_created_idx
  on public.stories (user_id, created_at desc);
-- Non-partial (now() is STABLE, not IMMUTABLE, so cannot be a predicate).
create index if not exists stories_expires_at_idx
  on public.stories (expires_at);
