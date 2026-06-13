-- =========================================================================
-- Smart Matching + Connections
-- =========================================================================
-- Adds:
--   * user_matching_prefs  — user-declared industry / intent / looking_for
--   * connections          — directional connect requests (pending/accepted/declined)
-- Behavior signals (likes/follows) and skill/tool/industry data are read
-- live from existing tables; no materialised aggregates yet.
-- =========================================================================

-- 1. Per-user matching preferences --------------------------------------
create table if not exists public.user_matching_prefs (
  user_id uuid primary key references public.profiles(id) on delete cascade,

  -- Context: where they operate
  industry text,                    -- e.g. 'edtech', 'saas'
  sub_domains text[] not null default '{}'::text[],

  -- Intent: why they are here (Layer 3 in matching formula)
  intent text check (intent in (
    'hiring','looking_for_clients','seeking_funding',
    'collaboration','learning','showcase'
  )),
  -- Complement of intent — who they WANT to meet.
  looking_for text[] not null default '{}'::text[],

  -- Optional signals
  location text,                    -- city / region free text
  activity_level text default 'medium' check (activity_level in (
    'low','medium','high'
  )),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ump_industry_idx
  on public.user_matching_prefs (industry);
create index if not exists ump_intent_idx
  on public.user_matching_prefs (intent);
create index if not exists ump_looking_for_gin
  on public.user_matching_prefs using gin (looking_for);


-- 2. Directed connections -----------------------------------------------
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in (
    'pending','accepted','declined'
  )),
  intro_message text,
  match_score int,                 -- snapshot of % at request time
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint connections_no_self check (requester_id <> addressee_id),
  constraint connections_pair_unique unique (requester_id, addressee_id)
);

create index if not exists connections_addressee_status_idx
  on public.connections (addressee_id, status);
create index if not exists connections_requester_status_idx
  on public.connections (requester_id, status);


-- 3. updated_at triggers -------------------------------------------------
create or replace function public.ump_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists ump_touch_updated_at on public.user_matching_prefs;
create trigger ump_touch_updated_at
  before update on public.user_matching_prefs
  for each row execute function public.ump_touch_updated_at();


-- 4. Row-Level Security --------------------------------------------------
alter table public.user_matching_prefs enable row level security;
alter table public.connections enable row level security;

-- Prefs: anyone authenticated may read (they drive match reasons shown to
-- others). Only the owner may write.
drop policy if exists ump_select on public.user_matching_prefs;
create policy ump_select on public.user_matching_prefs
  for select using (true);

drop policy if exists ump_self_write on public.user_matching_prefs;
create policy ump_self_write on public.user_matching_prefs
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Connections: readable only by the two parties.
drop policy if exists conn_select_parties on public.connections;
create policy conn_select_parties on public.connections
  for select using (
    auth.uid() = requester_id or auth.uid() = addressee_id
  );

-- Requester may insert their own outgoing request.
drop policy if exists conn_insert_self on public.connections;
create policy conn_insert_self on public.connections
  for insert with check (requester_id = auth.uid());

-- Addressee may update status (accept/decline).
drop policy if exists conn_update_addressee on public.connections;
create policy conn_update_addressee on public.connections
  for update using (addressee_id = auth.uid())
  with check (addressee_id = auth.uid());

-- Requester may withdraw (delete) while still pending.
drop policy if exists conn_delete_requester on public.connections;
create policy conn_delete_requester on public.connections
  for delete using (
    requester_id = auth.uid() and status = 'pending'
  );


-- 5. Helper view: accepted network --------------------------------------
-- Bi-directional view so `select * from my_network where user_id = :me`
-- returns everyone I'm connected to, regardless of who sent the request.
drop view if exists public.my_network;
create view public.my_network as
select
  c.id           as connection_id,
  c.requester_id as user_id,
  c.addressee_id as peer_id,
  c.created_at,
  c.responded_at
from public.connections c
where c.status = 'accepted'
union all
select
  c.id           as connection_id,
  c.addressee_id as user_id,
  c.requester_id as peer_id,
  c.created_at,
  c.responded_at
from public.connections c
where c.status = 'accepted';

grant select on public.my_network to anon, authenticated;
