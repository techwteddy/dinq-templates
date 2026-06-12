-- Enable RLS on all tables
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table habits enable row level security;
alter table focus_sessions enable row level security;
alter table ai_suggestions enable row level security;
alter table waitlist enable row level security;
alter table contact_submissions enable row level security;
alter table page_analytics enable row level security;

-- Profiles: users can only read/update their own
-- Insert handled by trigger on auth.users

create policy "Public profiles are viewable by owner"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Tasks: full CRUD by owner only
create policy "Tasks select by owner"
  on tasks for select using ( auth.uid() = user_id );
create policy "Tasks insert by owner"
  on tasks for insert with check ( auth.uid() = user_id );
create policy "Tasks update by owner"
  on tasks for update using ( auth.uid() = user_id );
create policy "Tasks delete by owner"
  on tasks for delete using ( auth.uid() = user_id );

-- Habits: full CRUD by owner only
create policy "Habits select by owner"
  on habits for select using ( auth.uid() = user_id );
create policy "Habits insert by owner"
  on habits for insert with check ( auth.uid() = user_id );
create policy "Habits update by owner"
  on habits for update using ( auth.uid() = user_id );
create policy "Habits delete by owner"
  on habits for delete using ( auth.uid() = user_id );

-- Focus sessions: full CRUD by owner only
create policy "Focus select by owner"
  on focus_sessions for select using ( auth.uid() = user_id );
create policy "Focus insert by owner"
  on focus_sessions for insert with check ( auth.uid() = user_id );
create policy "Focus update by owner"
  on focus_sessions for update using ( auth.uid() = user_id );
create policy "Focus delete by owner"
  on focus_sessions for delete using ( auth.uid() = user_id );

-- AI suggestions: select/insert/update by owner, service role can delete old
create policy "AI suggestions select by owner"
  on ai_suggestions for select using ( auth.uid() = user_id );
create policy "AI suggestions insert by owner"
  on ai_suggestions for insert with check ( auth.uid() = user_id );
create policy "AI suggestions update by owner"
  on ai_suggestions for update using ( auth.uid() = user_id );

-- Waitlist: insert allowed for anon (rate limited at app layer), no select for anon
create policy "Waitlist insert for anon"
  on waitlist for insert to anon with check ( true );
create policy "Waitlist select for service role"
  on waitlist for select to service_role using ( true );
create policy "Waitlist update for service role"
  on waitlist for update to service_role using ( true );

-- Contact submissions: insert for anon, select for authenticated admins
create policy "Contact insert for anon"
  on contact_submissions for insert to anon with check ( true );

-- Analytics: insert for anon, select for authenticated
create policy "Analytics insert for anon"
  on page_analytics for insert to anon with check ( true );
create policy "Analytics select for authenticated"
  on page_analytics for select to authenticated using ( true );
