-- Allowed emails table — whitelist of family members
create table if not exists public.allowed_emails (
  email text primary key
);

-- Seed allowed family members (replace with your family's Google emails)
insert into public.allowed_emails (email) values
  ('parent1@gmail.com'),
  ('parent2@gmail.com');

-- Enable RLS on allowed_emails (only service role should touch it)
alter table public.allowed_emails enable row level security;

-- ── Drop old permissive "allow all" policies ──

drop policy if exists "Allow all on events" on public.events;
drop policy if exists "Allow all on shopping_lists" on public.shopping_lists;
drop policy if exists "Allow all on shopping_items" on public.shopping_items;
drop policy if exists "Allow all on chores" on public.chores;
drop policy if exists "Allow all on projects" on public.projects;
drop policy if exists "Allow all on project_tasks" on public.project_tasks;

-- ── Helper: check if user is an allowed family member ──

create or replace function public.is_allowed_user()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.allowed_emails
    where email = auth.jwt()->>'email'
  );
$$;

-- ── New RLS policies: authenticated + whitelisted ──

-- events
create policy "Family access on events" on public.events
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- shopping_lists
create policy "Family access on shopping_lists" on public.shopping_lists
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- shopping_items
create policy "Family access on shopping_items" on public.shopping_items
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- chores
create policy "Family access on chores" on public.chores
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- projects
create policy "Family access on projects" on public.projects
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());

-- project_tasks
create policy "Family access on project_tasks" on public.project_tasks
  for all using (auth.role() = 'authenticated' and public.is_allowed_user())
  with check (auth.role() = 'authenticated' and public.is_allowed_user());
