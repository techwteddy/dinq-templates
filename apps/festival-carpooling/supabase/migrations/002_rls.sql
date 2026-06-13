-- ============================================================
-- 002_rls.sql  —  Row-Level Security policies
-- ============================================================

alter table public.festivals      enable row level security;
alter table public.profiles       enable row level security;
alter table public.rides          enable row level security;
alter table public.ride_requests  enable row level security;
alter table public.announcements  enable row level security;
alter table public.reports        enable row level security;
alter table public.app_config     enable row level security;

-- ============================================================
-- FESTIVALS
-- ============================================================
create policy "Festivals are publicly readable"
  on public.festivals for select using (true);

-- ============================================================
-- PROFILES
-- ============================================================
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- RIDES
-- ============================================================

-- Public: active, non-deleted rides
create policy "Active rides are publicly visible"
  on public.rides for select
  using (deleted_at is null and status != 'cancelled');

-- Drivers see their own rides including cancelled (for profile/dashboard)
create policy "Drivers see their own rides"
  on public.rides for select
  using (driver_id = auth.uid() and deleted_at is null);

-- Admins see everything
create policy "Admins see all rides"
  on public.rides for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Authenticated users can create rides"
  on public.rides for insert
  with check (auth.uid() = driver_id);

create policy "Drivers can update their own rides"
  on public.rides for update
  using (auth.uid() = driver_id and deleted_at is null);

create policy "Admins can soft-delete any ride"
  on public.rides for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- RIDE REQUESTS
-- ============================================================

-- Passengers see their own requests; drivers see requests on their rides
create policy "Passengers and drivers see relevant requests"
  on public.ride_requests for select
  using (
    deleted_at is null
    and (
      passenger_id = auth.uid()
      or ride_id in (
        select id from public.rides where driver_id = auth.uid()
      )
    )
  );

create policy "Authenticated users can create ride requests"
  on public.ride_requests for insert
  with check (auth.uid() = passenger_id);

-- Drivers can accept/decline; passengers can cancel their own
create policy "Drivers and passengers can update requests"
  on public.ride_requests for update
  using (
    deleted_at is null
    and (
      passenger_id = auth.uid()
      or ride_id in (
        select id from public.rides where driver_id = auth.uid()
      )
    )
  );

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create policy "Published announcements are publicly visible"
  on public.announcements for select
  using (published = true);

create policy "Admins can manage all announcements"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- REPORTS
-- ============================================================
create policy "Authenticated users can submit reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Admins can view all reports"
  on public.reports for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can resolve reports"
  on public.reports for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- APP CONFIG
-- ============================================================
create policy "App config is publicly readable"
  on public.app_config for select using (true);

create policy "Admins can update app config"
  on public.app_config for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
