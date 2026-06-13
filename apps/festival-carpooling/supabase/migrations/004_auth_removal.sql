-- ============================================================
-- 004_auth_removal.sql  —  Token-based ownership, no auth
-- ============================================================

-- ============================================================
-- RIDES: driver identity + management token
-- ============================================================
alter table public.rides
  add column if not exists driver_name text,
  add column if not exists driver_email text,
  add column if not exists management_token uuid default gen_random_uuid() not null;

alter table public.rides alter column driver_id drop not null;

alter table public.rides
  add constraint rides_management_token_unique unique (management_token);

-- ============================================================
-- RIDE REQUESTS: anonymous passenger identity
-- ============================================================
alter table public.ride_requests
  add column if not exists passenger_name text,
  add column if not exists passenger_contact text;

alter table public.ride_requests alter column passenger_id drop not null;

-- ============================================================
-- DROP auth-dependent write policies
-- All non-admin writes now go through service_role in server actions
-- ============================================================
drop policy if exists "Authenticated users can create rides" on public.rides;
drop policy if exists "Drivers can update their own rides" on public.rides;
drop policy if exists "Authenticated users can create ride requests" on public.ride_requests;
drop policy if exists "Drivers and passengers can update requests" on public.ride_requests;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Authenticated users can submit reports" on public.reports;
drop policy if exists "Drivers see their own rides" on public.rides;

-- ============================================================
-- UPDATE accept_ride_request: use management_token instead of auth.uid()
-- ============================================================
create or replace function accept_ride_request(p_request_id uuid, p_management_token uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_ride    public.rides;
  v_request public.ride_requests;
  v_seats_free int;
begin
  select * into v_request
  from public.ride_requests
  where id = p_request_id and status = 'pending' and deleted_at is null
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'request_not_found_or_not_pending');
  end if;

  select * into v_ride
  from public.rides
  where id = v_request.ride_id and deleted_at is null
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'ride_not_found');
  end if;

  if v_ride.management_token != p_management_token then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;

  v_seats_free := v_ride.total_seats - v_ride.seats_taken;
  if v_seats_free < v_request.seats_requested then
    return jsonb_build_object('ok', false, 'error', 'no_seats_available');
  end if;

  update public.ride_requests
  set status = 'accepted'
  where id = p_request_id;

  update public.rides
  set
    seats_taken = seats_taken + v_request.seats_requested,
    status = case
      when (seats_taken + v_request.seats_requested) >= total_seats then 'full'
      else 'active'
    end
  where id = v_ride.id;

  return jsonb_build_object('ok', true);
end;
$$;
