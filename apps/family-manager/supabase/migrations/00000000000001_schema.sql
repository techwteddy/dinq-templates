-- ============================================
-- My Family Genius — Initial Schema
-- ============================================

-- Events (Calendar)
create table events (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  start_date date not null,
  start_time time,
  end_date date,
  end_time time,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shopping Lists
create table shopping_lists (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shopping Items
create table shopping_items (
  id bigint generated always as identity primary key,
  list_id bigint not null references shopping_lists(id) on delete cascade,
  name text not null,
  quantity text,
  category text,
  checked boolean default false,
  created_at timestamptz default now()
);

-- Chores
create table chores (
  id bigint generated always as identity primary key,
  name text not null,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
  assignee text,
  last_completed timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Home Projects
create table projects (
  id bigint generated always as identity primary key,
  name text not null,
  status text not null default 'planned' check (status in ('planned', 'in-progress', 'done')),
  description text,
  notes text,
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project Tasks
create table project_tasks (
  id bigint generated always as identity primary key,
  project_id bigint not null references projects(id) on delete cascade,
  name text not null,
  done boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- ============================================
-- RLS — permissive (no auth, anon key access)
-- ============================================

alter table events enable row level security;
create policy "Allow all on events" on events for all using (true) with check (true);

alter table shopping_lists enable row level security;
create policy "Allow all on shopping_lists" on shopping_lists for all using (true) with check (true);

alter table shopping_items enable row level security;
create policy "Allow all on shopping_items" on shopping_items for all using (true) with check (true);

alter table chores enable row level security;
create policy "Allow all on chores" on chores for all using (true) with check (true);

alter table projects enable row level security;
create policy "Allow all on projects" on projects for all using (true) with check (true);

alter table project_tasks enable row level security;
create policy "Allow all on project_tasks" on project_tasks for all using (true) with check (true);
