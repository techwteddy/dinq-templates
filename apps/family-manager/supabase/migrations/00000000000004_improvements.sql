-- v1.1 improvements: meal plan, assignees, member notifications

-- 1. Meal plan table
create table if not exists public.meal_plan (
  id bigint generated always as identity primary key,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  member_name text not null,
  meal text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meal_plan enable row level security;

create policy "Family access on meal_plan" on public.meal_plan
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- 2. Add assignee columns
alter table public.events add column if not exists assignee text;
alter table public.project_tasks add column if not exists assignee text;
alter table public.shopping_lists add column if not exists assignee text;

-- 3. Rename push_subscriptions.kid_name -> member_name, expand allowed names
alter table public.push_subscriptions rename column kid_name to member_name;
alter table public.push_subscriptions drop constraint if exists push_subscriptions_kid_name_check;
alter table public.push_subscriptions add constraint push_subscriptions_member_name_check
  check (member_name in ('Parent1', 'Parent2', 'Kid1', 'Kid2', 'Kid3'));
