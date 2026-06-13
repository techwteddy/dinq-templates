-- ============================================================
-- seed.sql  —  Demo festival + sample data
-- Run after migrations on your development Supabase project.
-- Replace "Example Festival 2026" / "example-festival-2026" with your event.
-- ============================================================

-- App config: CO₂ emission factor
insert into public.app_config (key, value, description) values
  ('co2_factor_kg_per_km', 0.12, 'kg CO₂ avoided per passenger per km (avg petrol car, EEA source)')
on conflict (key) do nothing;

-- The festival (edit name, slug, location, and dates to match your event)
insert into public.festivals (name, slug, location, starts_at, ends_at, is_active) values
  ('Example Festival 2026', 'example-festival-2026', 'City, Country', '2026-07-01', '2026-07-05', true)
on conflict (slug) do nothing;

-- Sample announcements
insert into public.announcements (festival_id, title, body, pinned, published)
select
  f.id,
  'Welcome to the carpooling platform',
  'Share your ride, share the vibe. Use this platform to coordinate your trip to and from the festival. Post your ride, find a seat, and help us keep the roads — and the skies — a little cleaner.',
  true,
  true
from public.festivals f
where f.slug = 'example-festival-2026';

insert into public.announcements (festival_id, title, body, pinned, published)
select
  f.id,
  'How carpooling works',
  'Drivers post their ride with departure city, time, and available seats. Passengers send a request with a short message. Once the driver accepts, contact details are shared. Simple as that.',
  false,
  true
from public.festivals f
where f.slug = 'example-festival-2026';
