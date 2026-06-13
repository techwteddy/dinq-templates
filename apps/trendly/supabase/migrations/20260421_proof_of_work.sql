-- =========================================================================
-- Proof-of-Work feed
-- =========================================================================
-- Adds a new post "kind" plus a 1:1 metadata table that captures the nine
-- layers of proof data (work context, stack, timeline, collaborators,
-- intent, skills, business context, trust signals, process notes).
-- =========================================================================

-- 1. posts.kind (regular vs proof_of_work) -------------------------------
alter table public.posts
  add column if not exists kind text not null default 'regular'
    check (kind in ('regular', 'proof_of_work'));

create index if not exists posts_kind_created_at_idx
  on public.posts (kind, created_at desc);


-- 2. Proof-of-Work metadata (1:1 with posts) -----------------------------
create table if not exists public.proof_of_work_meta (
  post_id uuid primary key references public.posts(id) on delete cascade,

  -- 1) Work Context Layer
  project_title text not null,
  work_type text not null check (work_type in (
    'design','development','marketing','product','content','research','other'
  )),
  stage text not null default 'in_progress' check (stage in (
    'idea','in_progress','completed'
  )),

  -- 2) Verified Stack
  tools text[] not null default '{}'::text[],

  -- 3) Timeline / Effort
  time_spent_hours numeric(6, 2),
  started_at date,

  -- 5) Outcome / Intent
  intent text check (intent in (
    'hiring','funding','feedback','collaboration','showcase'
  )),

  -- 6) Skill Tags (structured, lowercase)
  skills text[] not null default '{}'::text[],

  -- 7) Business Context
  industry text,
  target_audience text,
  use_case text,

  -- 9) Process Notes
  problem_solved text,
  key_decisions text,
  challenges text,

  -- meta
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pow_meta_work_type_idx
  on public.proof_of_work_meta (work_type);
create index if not exists pow_meta_stage_idx
  on public.proof_of_work_meta (stage);
create index if not exists pow_meta_intent_idx
  on public.proof_of_work_meta (intent);
create index if not exists pow_meta_skills_gin
  on public.proof_of_work_meta using gin (skills);
create index if not exists pow_meta_tools_gin
  on public.proof_of_work_meta using gin (tools);


-- 3. Collaborator verification (4th layer) -------------------------------
create table if not exists public.proof_of_work_collaborators (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in (
    'pending','verified','declined'
  )),
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  primary key (post_id, user_id)
);

create index if not exists pow_collab_user_status_idx
  on public.proof_of_work_collaborators (user_id, status);


-- 4. updated_at trigger --------------------------------------------------
create or replace function public.pow_meta_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists pow_meta_touch_updated_at on public.proof_of_work_meta;
create trigger pow_meta_touch_updated_at
  before update on public.proof_of_work_meta
  for each row execute function public.pow_meta_touch_updated_at();


-- 5. Row-Level Security --------------------------------------------------
alter table public.proof_of_work_meta enable row level security;
alter table public.proof_of_work_collaborators enable row level security;

-- Meta: readable by anyone authenticated (same privacy as posts)
drop policy if exists pow_meta_select on public.proof_of_work_meta;
create policy pow_meta_select on public.proof_of_work_meta
  for select using (true);

-- Meta: only the post author may insert / update / delete
drop policy if exists pow_meta_author_write on public.proof_of_work_meta;
create policy pow_meta_author_write on public.proof_of_work_meta
  for all using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.user_id = auth.uid()
    )
  );

-- Collab: anyone can read
drop policy if exists pow_collab_select on public.proof_of_work_collaborators;
create policy pow_collab_select on public.proof_of_work_collaborators
  for select using (true);

-- Collab: post author may invite; collaborator may respond (update own row)
drop policy if exists pow_collab_author_insert on public.proof_of_work_collaborators;
create policy pow_collab_author_insert on public.proof_of_work_collaborators
  for insert with check (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.user_id = auth.uid()
    )
  );

drop policy if exists pow_collab_self_update on public.proof_of_work_collaborators;
create policy pow_collab_self_update on public.proof_of_work_collaborators
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists pow_collab_author_delete on public.proof_of_work_collaborators;
create policy pow_collab_author_delete on public.proof_of_work_collaborators
  for delete using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.user_id = auth.uid()
    )
  );


-- 6. Helper view: proof_of_work_feed -------------------------------------
-- Convenience view joining post + author + meta + verified collab count.
-- (Trust Signal #8 is computed as count of verified collaborators.)
drop view if exists public.proof_of_work_feed;
create view public.proof_of_work_feed as
select
  p.id,
  p.user_id,
  p.caption,
  p.image_url,
  p.media_type,
  p.created_at,
  pr.username            as author_username,
  pr.avatar_url          as author_avatar,
  m.project_title,
  m.work_type,
  m.stage,
  m.tools,
  m.time_spent_hours,
  m.started_at,
  m.intent,
  m.skills,
  m.industry,
  m.target_audience,
  m.use_case,
  m.problem_solved,
  m.key_decisions,
  m.challenges,
  coalesce((
    select count(*) from public.proof_of_work_collaborators c
    where c.post_id = p.id and c.status = 'verified'
  ), 0) as verified_collaborators
from public.posts p
join public.profiles pr on pr.id = p.user_id
join public.proof_of_work_meta m on m.post_id = p.id
where p.kind = 'proof_of_work';

grant select on public.proof_of_work_feed to anon, authenticated;
