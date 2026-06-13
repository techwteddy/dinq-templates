-- ============================================================
-- 001_schema.sql  —  Core tables
-- ============================================================

-- FESTIVALS
create table public.festivals (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  slug       text not null unique,
  location   text,
  starts_at  date,
  ends_at    date,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- PROFILES (extends auth.users)
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  avatar_url   text,
  phone        text,
  bio          text,
  is_admin     boolean default false,
  created_at   timestamptz default now()
);

-- RIDES
create table public.rides (
  id           uuid default gen_random_uuid() primary key,
  festival_id  uuid references public.festivals(id) not null,
  driver_id    uuid references public.profiles(id) on delete cascade not null,

  -- Trip
  origin_city  text not null,
  destination  text not null,
  departure_at timestamptz not null,
  return_trip  boolean default false,

  -- Capacity
  total_seats  int not null check (total_seats between 1 and 8),
  seats_taken  int default 0 check (seats_taken >= 0),

  -- Optional details
  fuel_contribution_eur numeric(6,2),
  notes                 text,
  meeting_point         text,

  -- CO₂
  distance_km           numeric(6,1),
  estimated_co2_saved_kg numeric(8,2) default 0,

  -- State
  status     text default 'active'
               check (status in ('active', 'full', 'cancelled')),
  deleted_at timestamptz default null,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RIDE REQUESTS
create table public.ride_requests (
  id               uuid default gen_random_uuid() primary key,
  ride_id          uuid references public.rides(id) on delete cascade not null,
  passenger_id     uuid references public.profiles(id) on delete cascade not null,
  seats_requested  int default 1 check (seats_requested >= 1),
  message          text,
  status           text default 'pending'
                     check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  deleted_at       timestamptz default null,
  created_at       timestamptz default now(),

  unique (ride_id, passenger_id)
);

-- ANNOUNCEMENTS
create table public.announcements (
  id          uuid default gen_random_uuid() primary key,
  festival_id uuid references public.festivals(id) not null,
  author_id   uuid references public.profiles(id) on delete set null,
  title       text not null,
  body        text not null,
  pinned      boolean default false,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- REPORTS (lightweight moderation)
create table public.reports (
  id          uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete set null,
  ride_id     uuid references public.rides(id) on delete cascade,
  reason      text not null,
  resolved    boolean default false,
  created_at  timestamptz default now()
);

-- APP CONFIG (emission factors, tunable without migration)
create table public.app_config (
  key         text primary key,
  value       numeric not null,
  description text
);

-- ============================================================
-- INDEXES
-- ============================================================
create index on public.rides (festival_id, departure_at) where deleted_at is null;
create index on public.rides (driver_id) where deleted_at is null;
create index on public.rides (status) where deleted_at is null;
create index on public.ride_requests (passenger_id) where deleted_at is null;
create index on public.ride_requests (ride_id) where deleted_at is null;
create index on public.announcements (festival_id, created_at desc);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger rides_updated_at
  before update on public.rides
  for each row execute procedure update_updated_at();
