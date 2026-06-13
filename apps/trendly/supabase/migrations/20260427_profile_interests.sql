-- =========================================================================
-- Profile interests — seeded by the onboarding interest picker.
-- =========================================================================
alter table public.profiles
  add column if not exists interests text[] default '{}'::text[];
