-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  priority text check (priority in ('low','medium','high')),
  status text default 'todo' check (status in ('todo','in_progress','done')),
  ai_category text,
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_tasks_user on tasks(user_id);
create index idx_tasks_status on tasks(status);

-- Habits
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  emoji text default '✅',
  streak integer default 0,
  longest_streak integer default 0,
  completed_dates text[] default '{}',
  reminder_time text,
  created_at timestamptz default now()
);
create index idx_habits_user on habits(user_id);

-- Focus sessions
create table if not exists focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  duration_seconds integer not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  label text,
  created_at timestamptz default now()
);
create index idx_focus_user on focus_sessions(user_id);
create index idx_focus_started on focus_sessions(started_at desc);

-- AI suggestions
create table if not exists ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('task','habit','focus','general')),
  content text not null,
  reason text,
  dismissed boolean default false,
  created_at timestamptz default now()
);
create index idx_ai_user on ai_suggestions(user_id);

-- Waitlist (landing page)
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  referral_source text,
  position integer generated always as identity,
  confirmed boolean default false,
  confirmation_token uuid default gen_random_uuid(),
  ip_hash text,
  created_at timestamptz default now()
);

-- Contact submissions
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null check (char_length(message) <= 2000),
  status text default 'new' check (status in ('new','read','replied')),
  created_at timestamptz default now()
);

-- Page analytics
create table if not exists page_analytics (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  session_id text,
  metadata jsonb,
  created_at timestamptz default now()
);
