-- ============================================================
-- 003_functions.sql  —  RPCs, triggers, CO₂ logic
-- ============================================================

-- ============================================================
-- CO₂ RECALCULATION
-- Reads emission factor from app_config so it can be tuned
-- without a migration.
-- ============================================================
create or replace function recalculate_ride_co2(p_ride_id uuid)
returns void
language plpgsql
as $$
declare
  v_distance     numeric(6,1);
  v_accepted_pax int;
  v_factor       numeric;
begin
  select distance_km into v_distance
  from public.rides where id = p_ride_id;

  if v_distance is null or v_distance <= 0 then
    return;
  end if;

  select value into v_factor
  from public.app_config
  where key = 'co2_factor_kg_per_km';

  if v_factor is null then
    v_factor := 0.12; -- safe fallback
  end if;

  select coalesce(sum(seats_requested), 0) into v_accepted_pax
  from public.ride_requests
  where ride_id = p_ride_id
    and status = 'accepted'
    and deleted_at is null;

  update public.rides
  set estimated_co2_saved_kg = v_accepted_pax * v_distance * v_factor
  where id = p_ride_id;
end;
$$;

-- Trigger: recalculate CO₂ on any ride_request state change
create or replace function trigger_recalculate_co2_from_requests()
returns trigger language plpgsql as $$
begin
  perform recalculate_ride_co2(coalesce(new.ride_id, old.ride_id));
  return null;
end;
$$;

create trigger ride_requests_sync_co2
  after insert or update or delete on public.ride_requests
  for each row execute procedure trigger_recalculate_co2_from_requests();

-- Trigger: recalculate CO₂ when driver updates distance_km
create or replace function trigger_recalculate_co2_from_distance()
returns trigger language plpgsql as $$
begin
  if new.distance_km is distinct from old.distance_km then
    perform recalculate_ride_co2(new.id);
  end if;
  return null;
end;
$$;

create trigger rides_co2_on_distance_change
  after update of distance_km on public.rides
  for each row execute procedure trigger_recalculate_co2_from_distance();

-- ============================================================
-- ACCEPT RIDE REQUEST
-- Uses SELECT FOR UPDATE to prevent concurrent overbooking.
-- Returns jsonb { ok: bool, error?: string }
-- ============================================================
create or replace function accept_ride_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_ride    public.rides;
  v_request public.ride_requests;
  v_seats_free int;
begin
  -- Lock the request row
  select * into v_request
  from public.ride_requests
  where id = p_request_id and status = 'pending' and deleted_at is null
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'request_not_found_or_not_pending');
  end if;

  -- Lock the ride row (prevents concurrent accepts on the same ride)
  select * into v_ride
  from public.rides
  where id = v_request.ride_id and deleted_at is null
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'ride_not_found');
  end if;

  -- Caller must be the driver
  if v_ride.driver_id != auth.uid() then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;

  -- Check available seats
  v_seats_free := v_ride.total_seats - v_ride.seats_taken;
  if v_seats_free < v_request.seats_requested then
    return jsonb_build_object('ok', false, 'error', 'no_seats_available');
  end if;

  -- Accept the request
  update public.ride_requests
  set status = 'accepted'
  where id = p_request_id;
  -- Note: ride_requests_sync_co2 trigger fires here automatically

  -- Sync seats_taken and ride status
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

-- ============================================================
-- COMMUNITY STATS
-- Supports scopes: 'today' | 'festival' | 'all_time'
-- ============================================================
create or replace function get_community_stats(
  p_festival_id uuid,
  p_scope       text default 'festival'
)
returns jsonb
language plpgsql
volatile
as $$
begin
  return (
    select jsonb_build_object(
      'total_rides',        count(*),
      'total_passengers',   coalesce(sum(seats_taken), 0),
      'total_co2_saved_kg', coalesce(round(sum(estimated_co2_saved_kg), 1), 0)
    )
    from public.rides
    where deleted_at  is null
      and status      in ('active', 'full')
      and seats_taken > 0
      and (p_scope = 'all_time' or festival_id = p_festival_id)
      and (
        p_scope != 'today'
        or (
          departure_at >= current_date
          and departure_at < current_date + interval '1 day'
        )
      )
  );
end;
$$;
