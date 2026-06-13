-- =========================================================================
-- Story text-overlay + audio attachments on posts and stories
-- =========================================================================
-- Stories support an HTML text overlay rendered by the viewer (not baked
-- into the image so videos can use it too). Both posts and stories may
-- have an attached audio_url for music.
-- =========================================================================

alter table public.stories
  add column if not exists overlay_text text,
  add column if not exists overlay_color text default '#ffffff',
  add column if not exists overlay_y real default 0.5,
  add column if not exists audio_url text;

alter table public.posts
  add column if not exists audio_url text;
