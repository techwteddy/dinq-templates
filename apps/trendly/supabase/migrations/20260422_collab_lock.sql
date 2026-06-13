-- =========================================================================
-- Collab Lock — Verified Collaboration System
-- =========================================================================
-- Extends the existing proof_of_work_collaborators table (migration
-- 20260421_proof_of_work.sql) with:
--   * a `role` string      — what the invitee did (e.g. "design", "backend")
--   * an optional `note`   — short context attached at accept time
--   * a self-invite guard  — post authors can't fake-verify themselves
--   * helper views         — cheap reads for profile + inbox surfaces
--
-- Collaboration is only visible as VERIFIED after both parties confirm.
-- =========================================================================

-- 1. Extend the existing collaborators table -----------------------------

alter table public.proof_of_work_collaborators
  add column if not exists role text,
  add column if not exists note text;

-- Index to make "collab inbox" queries cheap (pending invites where I'm
-- the invitee, sorted by most recent).
create index if not exists pow_collab_user_invited_idx
  on public.proof_of_work_collaborators (user_id, invited_at desc);


-- 2. Self-invite guard --------------------------------------------------
-- Block an author from inviting themselves as a collaborator on their own
-- post — otherwise "verified history" means nothing.

create or replace function public.pow_collab_guard()
returns trigger language plpgsql as $$
declare
  author uuid;
begin
  select user_id into author from public.posts where id = new.post_id;
  if author is null then
    raise exception 'post % not found', new.post_id;
  end if;
  if author = new.user_id then
    raise exception 'cannot invite the post author as a collaborator';
  end if;
  return new;
end
$$;

drop trigger if exists pow_collab_guard on public.proof_of_work_collaborators;
create trigger pow_collab_guard
  before insert on public.proof_of_work_collaborators
  for each row execute function public.pow_collab_guard();


-- 3. Touch responded_at on status change --------------------------------

create or replace function public.pow_collab_touch_responded()
returns trigger language plpgsql as $$
begin
  if old.status is distinct from new.status
     and new.status in ('verified','declined')
     and new.responded_at is null then
    new.responded_at = now();
  end if;
  return new;
end
$$;

drop trigger if exists pow_collab_touch_responded on public.proof_of_work_collaborators;
create trigger pow_collab_touch_responded
  before update on public.proof_of_work_collaborators
  for each row execute function public.pow_collab_touch_responded();


-- 4. verified_collab_proofs — per-user view of verified collaborations ---
-- Returns every post where `user_id` is either the author OR an approved
-- collaborator. Useful for rendering "Verified Collaborations" strips on a
-- profile page, and for counting a user's trust signal globally.

drop view if exists public.verified_collab_proofs;
create view public.verified_collab_proofs as
-- authored posts that carry at least one verified collaborator
select
  p.user_id               as user_id,
  p.id                    as post_id,
  p.image_url,
  p.media_type,
  p.created_at,
  m.project_title,
  'author'::text          as my_role,
  (
    select count(*) from public.proof_of_work_collaborators c
    where c.post_id = p.id and c.status = 'verified'
  )                       as verified_count
from public.posts p
join public.proof_of_work_meta m on m.post_id = p.id
where p.kind = 'proof_of_work'
  and exists (
    select 1 from public.proof_of_work_collaborators c
    where c.post_id = p.id and c.status = 'verified'
  )

union all

-- posts where the user is a verified collaborator
select
  c.user_id               as user_id,
  p.id                    as post_id,
  p.image_url,
  p.media_type,
  p.created_at,
  m.project_title,
  coalesce(c.role, 'collaborator') as my_role,
  (
    select count(*) from public.proof_of_work_collaborators c2
    where c2.post_id = p.id and c2.status = 'verified'
  )                       as verified_count
from public.proof_of_work_collaborators c
join public.posts p on p.id = c.post_id
join public.proof_of_work_meta m on m.post_id = p.id
where c.status = 'verified';

grant select on public.verified_collab_proofs to anon, authenticated;


-- 5. collab_inbox — pending invites addressed to a specific user ---------
-- One-stop read for the /collabs screen.

drop view if exists public.collab_inbox;
create view public.collab_inbox as
select
  c.user_id                as invitee_id,     -- filter: invitee_id = auth.uid()
  c.post_id,
  c.status,
  c.role,
  c.note,
  c.invited_at,
  c.responded_at,
  p.user_id                as author_id,
  p.image_url,
  p.media_type,
  m.project_title,
  author.username          as author_username,
  author.full_name         as author_full_name,
  author.avatar_url        as author_avatar_url
from public.proof_of_work_collaborators c
join public.posts p on p.id = c.post_id
join public.proof_of_work_meta m on m.post_id = p.id
join public.profiles author on author.id = p.user_id;

grant select on public.collab_inbox to authenticated;


-- 6. Notifications type column ------------------------------------------
-- No-op if the check constraint already allows these types. Kept here as a
-- documentation artefact of the types we fire from actions.ts:
--   'collab_invite'    — sent to the invitee when an author tags them
--   'collab_verified'  — sent to the author when the invitee approves
-- If your notifications table has a CHECK constraint on `type`, you'll
-- need to extend it to include these two values. (Trendly currently uses a
-- plain text column with no CHECK, so this block is intentionally empty.)
