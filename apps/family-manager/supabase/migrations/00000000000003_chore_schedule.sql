-- Kids' chore schedule table
create table if not exists public.chore_schedule (
  id bigint generated always as identity primary key,
  kid_name text not null check (kid_name in ('Kid1', 'Kid2', 'Kid3')),
  chore_name text not null,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  time_of_day time,
  last_completed timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.chore_schedule enable row level security;

create policy "Family access on chore_schedule" on public.chore_schedule
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- Push subscription table for web push notifications
create table if not exists public.push_subscriptions (
  id bigint generated always as identity primary key,
  kid_name text not null check (kid_name in ('Kid1', 'Kid2', 'Kid3')),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "Family access on push_subscriptions" on public.push_subscriptions
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- Add kids' emails to allowed_emails (replace with your kids' Google emails)
insert into public.allowed_emails (email) values
  ('kid1@gmail.com'),
  ('kid2@gmail.com'),
  ('kid3@gmail.com')
on conflict (email) do nothing;
