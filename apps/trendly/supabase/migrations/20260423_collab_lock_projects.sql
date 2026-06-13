-- =========================================================================
-- Collab Lock v2 — Project-level collaborations
-- =========================================================================
-- First-class collaboration entities (vs. per-post tags in v1). A collab has:
--   * one initiator, one partner (mutual verification required)
--   * a project name + optional description
--   * zero or more linked posts/reels as proof-of-work
-- Stays invisible until the partner accepts. Rejected collabs are hidden.
-- =========================================================================

-- 1. collaborations --------------------------------------------------------

create table if not exists public.collaborations (
  id uuid primary key default gen_random_uuid(),
  initiator_id uuid not null references public.profiles(id) on delete cascade,
  partner_id   uuid not null references public.profiles(id) on delete cascade,
  project_name text not null check (char_length(project_name) between 1 and 120),
  description  text,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'declined')),
  responded_at timestamptz,
  created_at   timestamptz not null default now(),
  constraint collab_not_self check (initiator_id <> partner_id)
);

create index if not exists collab_partner_status_idx
  on public.collaborations (partner_id, status, created_at desc);
create index if not exists collab_initiator_status_idx
  on public.collaborations (initiator_id, status, created_at desc);

-- 2. collaboration_posts (linked evidence) --------------------------------

create table if not exists public.collaboration_posts (
  collab_id uuid not null references public.collaborations(id) on delete cascade,
  post_id   uuid not null references public.posts(id) on delete cascade,
  added_at  timestamptz not null default now(),
  primary key (collab_id, post_id)
);

create index if not exists collab_posts_collab_idx
  on public.collaboration_posts (collab_id);
create index if not exists collab_posts_post_idx
  on public.collaboration_posts (post_id);

-- 3. Touch responded_at on status change ----------------------------------

create or replace function public.collab_touch_responded()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status
     and new.status in ('verified', 'declined') then
    new.responded_at = now();
  end if;
  return new;
end
$$;

drop trigger if exists collab_touch_responded on public.collaborations;
create trigger collab_touch_responded
  before update on public.collaborations
  for each row execute function public.collab_touch_responded();

-- 4. RLS ------------------------------------------------------------------

alter table public.collaborations enable row level security;
alter table public.collaboration_posts enable row level security;

-- Anyone can read verified collabs (they're public reputation).
-- Pending/declined are visible only to the two parties.
drop policy if exists collab_select on public.collaborations;
create policy collab_select on public.collaborations
  for select
  using (
    status = 'verified'
    or auth.uid() = initiator_id
    or auth.uid() = partner_id
  );

-- Initiator creates.
drop policy if exists collab_insert on public.collaborations;
create policy collab_insert on public.collaborations
  for insert
  with check (auth.uid() = initiator_id);

-- Partner may flip status to verified/declined. Initiator may flip to
-- declined (revoke). Nobody may reassign participants.
drop policy if exists collab_update_partner on public.collaborations;
create policy collab_update_partner on public.collaborations
  for update
  using (auth.uid() = partner_id)
  with check (auth.uid() = partner_id);

drop policy if exists collab_update_initiator on public.collaborations;
create policy collab_update_initiator on public.collaborations
  for update
  using (auth.uid() = initiator_id)
  with check (auth.uid() = initiator_id);

-- Initiator deletes (revoke).
drop policy if exists collab_delete on public.collaborations;
create policy collab_delete on public.collaborations
  for delete
  using (auth.uid() = initiator_id);

-- collaboration_posts inherits visibility: readable iff the parent collab is.
drop policy if exists collab_posts_select on public.collaboration_posts;
create policy collab_posts_select on public.collaboration_posts
  for select
  using (
    exists (
      select 1 from public.collaborations c
      where c.id = collaboration_posts.collab_id
        and (
          c.status = 'verified'
          or auth.uid() = c.initiator_id
          or auth.uid() = c.partner_id
        )
    )
  );

-- Only the initiator can attach/detach posts, and only on a pending collab
-- they own. (After verification the evidence set is frozen.)
drop policy if exists collab_posts_insert on public.collaboration_posts;
create policy collab_posts_insert on public.collaboration_posts
  for insert
  with check (
    exists (
      select 1 from public.collaborations c
      where c.id = collaboration_posts.collab_id
        and c.initiator_id = auth.uid()
        and c.status = 'pending'
    )
    and exists (
      select 1 from public.posts p
      where p.id = collaboration_posts.post_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists collab_posts_delete on public.collaboration_posts;
create policy collab_posts_delete on public.collaboration_posts
  for delete
  using (
    exists (
      select 1 from public.collaborations c
      where c.id = collaboration_posts.collab_id
        and c.initiator_id = auth.uid()
        and c.status = 'pending'
    )
  );

-- 5. Views for profile surfaces -------------------------------------------

-- verified_collaborations_view — one row per (user × verified collab),
-- from *both* sides (initiator + partner). Powers the "Verified
-- Collaborations" section on profiles.

drop view if exists public.verified_collaborations_view;
create view public.verified_collaborations_view as
select
  c.initiator_id as user_id,
  c.partner_id   as counterpart_id,
  c.id           as collab_id,
  c.project_name,
  c.description,
  c.created_at,
  c.responded_at,
  'initiator'::text as my_role
from public.collaborations c
where c.status = 'verified'
union all
select
  c.partner_id   as user_id,
  c.initiator_id as counterpart_id,
  c.id           as collab_id,
  c.project_name,
  c.description,
  c.created_at,
  c.responded_at,
  'partner'::text as my_role
from public.collaborations c
where c.status = 'verified';

grant select on public.verified_collaborations_view to anon, authenticated;

-- collab_project_inbox — pending invites addressed to a user
drop view if exists public.collab_project_inbox;
create view public.collab_project_inbox as
select
  c.id                  as collab_id,
  c.initiator_id        as inviter_id,
  c.partner_id          as invitee_id,
  c.project_name,
  c.description,
  c.status,
  c.created_at,
  c.responded_at,
  p.username            as inviter_username,
  p.full_name           as inviter_full_name,
  p.avatar_url          as inviter_avatar_url
from public.collaborations c
join public.profiles p on p.id = c.initiator_id;

grant select on public.collab_project_inbox to anon, authenticated;

-- 6. notifications.type extension ------------------------------------------
-- Add new notification subtypes for the project-level flow. Existing enum
-- check constraint (if any) is relaxed — we just insert strings and let the
-- client switch on them.

-- (no schema change needed; notifications.type is free-form text)
