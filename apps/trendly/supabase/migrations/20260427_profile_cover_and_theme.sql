-- =========================================================================
-- Profile cover photo + accent theme color
-- =========================================================================

alter table public.profiles
  add column if not exists cover_url text,
  add column if not exists theme_color text default '#f72585';
