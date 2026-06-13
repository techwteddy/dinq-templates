-- 005_add_stops.sql — intermediate stops on rides
alter table public.rides
  add column if not exists stops text;
