-- Migration 007: v3 improvements — family messages + meal ingredients

-- Family message board
create table if not exists family_messages (
  id bigint generated always as identity primary key,
  author text not null,
  message text not null,
  pinned boolean default false,
  created_at timestamptz default now()
);

alter table family_messages enable row level security;
create policy "Family access" on family_messages
  for all using (public.is_allowed_user())
  with check (public.is_allowed_user());

-- Meal ingredients (learn over time)
create table if not exists meal_ingredients (
  id bigint generated always as identity primary key,
  meal text not null,
  item_name text not null,
  quantity text,
  created_at timestamptz default now(),
  unique(meal, item_name)
);

alter table meal_ingredients enable row level security;
create policy "Family access" on meal_ingredients
  for all using (public.is_allowed_user())
  with check (public.is_allowed_user());
