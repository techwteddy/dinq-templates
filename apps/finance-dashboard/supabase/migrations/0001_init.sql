-- Finance Dashboard - initial schema
-- Every table uses uuid + RLS. An email allowlist gates who can create a profile.

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- =========================================================
-- ENUMS
-- =========================================================
create type public.user_role as enum ('admin', 'member', 'viewer');
create type public.transaction_type as enum ('income', 'expense');
create type public.transaction_status as enum ('paid', 'pending', 'overdue', 'scheduled');
create type public.account_type as enum ('checking', 'savings', 'credit_card', 'cash', 'investment');
create type public.category_type as enum ('income', 'expense');
create type public.recurrence_freq as enum ('monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual');

-- =========================================================
-- ALLOWLIST (gates who can have a profile)
-- =========================================================
create table public.allowed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role public.user_role not null default 'member',
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- PROFILES (mirrors auth.users filtered by the allowlist)
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role public.user_role not null default 'member',
  mfa_enrolled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: block profile creation if the email is not on the allowlist.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  allowed record;
begin
  select * into allowed from public.allowed_emails where lower(email) = lower(new.email) limit 1;
  if allowed is null then
    raise exception 'Email % is not authorized for this system.', new.email;
  end if;
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), allowed.role);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- CATEGORIES
-- =========================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.category_type not null,
  color text default '#71717a',
  icon text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, type)
);

-- =========================================================
-- ACCOUNTS
-- =========================================================
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bank text,
  type public.account_type not null default 'checking',
  initial_balance numeric(14,2) not null default 0,
  currency text not null default 'USD',
  active boolean not null default true,
  color text default '#18181b',
  last_digits text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- RECURRENCES (templates)
-- =========================================================
create table public.recurrences (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  type public.transaction_type not null,
  amount numeric(14,2) not null,
  category_id uuid references public.categories(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  frequency public.recurrence_freq not null default 'monthly',
  due_day smallint not null default 1 check (due_day between 1 and 31),
  start_date date not null default current_date,
  end_date date,
  active boolean not null default true,
  next_run date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- TRANSACTIONS
-- =========================================================
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  type public.transaction_type not null,
  amount numeric(14,2) not null check (amount >= 0),
  category_id uuid references public.categories(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  accrual_date date not null default current_date,
  due_date date not null default current_date,
  payment_date date,
  payment_method text,
  notes text,
  attachment_url text,
  recurrence_id uuid references public.recurrences(id) on delete set null,
  installment_current smallint,
  installment_total smallint,
  tags text[] default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_transactions_type on public.transactions(type);
create index idx_transactions_due on public.transactions(due_date);
create index idx_transactions_pay on public.transactions(payment_date);
create index idx_transactions_account on public.transactions(account_id);
create index idx_transactions_cat on public.transactions(category_id);

-- View with derived status
create or replace view public.v_transactions as
select
  t.*,
  case
    when t.payment_date is not null then 'paid'::public.transaction_status
    when t.due_date < current_date then 'overdue'::public.transaction_status
    when t.due_date > current_date + interval '30 days' then 'scheduled'::public.transaction_status
    else 'pending'::public.transaction_status
  end as status,
  c.name  as category_name,
  c.color as category_color,
  a.name  as account_name,
  a.color as account_color
from public.transactions t
left join public.categories c on c.id = t.category_id
left join public.accounts a on a.id = t.account_id;

-- =========================================================
-- AUDIT LOG
-- =========================================================
create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  diff jsonb,
  ip inet,
  ua text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- AGGREGATION FUNCTIONS
-- =========================================================
create or replace function public.fn_account_balance(p_account uuid)
returns numeric
language sql
stable
as $$
  select
    coalesce((select initial_balance from public.accounts where id = p_account), 0)
    + coalesce((
        select sum(case when type = 'income' then amount else -amount end)
        from public.transactions
        where account_id = p_account and payment_date is not null
      ), 0);
$$;

create or replace function public.fn_kpis_month(p_ref date default current_date)
returns table(
  month date,
  income_paid numeric,
  expense_paid numeric,
  income_pending numeric,
  expense_pending numeric,
  balance numeric
)
language sql
stable
as $$
  with ref as (
    select date_trunc('month', p_ref)::date as start,
           (date_trunc('month', p_ref) + interval '1 month - 1 day')::date as finish
  )
  select
    r.start as month,
    coalesce(sum(case when t.type='income' and t.payment_date is not null then t.amount end), 0) as income_paid,
    coalesce(sum(case when t.type='expense' and t.payment_date is not null then t.amount end), 0) as expense_paid,
    coalesce(sum(case when t.type='income' and t.payment_date is null then t.amount end), 0) as income_pending,
    coalesce(sum(case when t.type='expense' and t.payment_date is null then t.amount end), 0) as expense_pending,
    coalesce(sum(case when t.type='income' and t.payment_date is not null then t.amount
                      when t.type='expense' and t.payment_date is not null then -t.amount end), 0) as balance
  from ref r
  left join public.transactions t on t.due_date between r.start and r.finish
  group by r.start;
$$;

-- Whole monthly series in a single query (avoids N roundtrips).
create or replace function public.fn_kpis_series(p_months int default 12, p_ref date default current_date)
returns table(
  month date,
  income_paid numeric,
  expense_paid numeric,
  income_pending numeric,
  expense_pending numeric,
  balance numeric
)
language sql
stable
as $$
  with months as (
    select (date_trunc('month', p_ref) - make_interval(months => g))::date as start
    from generate_series(0, greatest(p_months - 1, 0)) g
  ),
  windows as (
    select start,
           (start + interval '1 month - 1 day')::date as finish
    from months
  )
  select
    w.start as month,
    coalesce(sum(case when t.type='income' and t.payment_date is not null then t.amount end), 0) as income_paid,
    coalesce(sum(case when t.type='expense' and t.payment_date is not null then t.amount end), 0) as expense_paid,
    coalesce(sum(case when t.type='income' and t.payment_date is null then t.amount end), 0) as income_pending,
    coalesce(sum(case when t.type='expense' and t.payment_date is null then t.amount end), 0) as expense_pending,
    coalesce(sum(case when t.type='income' and t.payment_date is not null then t.amount
                      when t.type='expense' and t.payment_date is not null then -t.amount end), 0) as balance
  from windows w
  left join public.transactions t on t.due_date between w.start and w.finish
  group by w.start
  order by w.start asc;
$$;

create or replace function public.fn_cashflow_projection(p_days int default 90)
returns table(day date, inflow numeric, outflow numeric, day_balance numeric)
language sql
stable
as $$
  with base as (
    select d::date as day
    from generate_series(current_date, current_date + make_interval(days => p_days), '1 day') d
  )
  select
    b.day,
    coalesce(sum(case when t.type='income' then t.amount end), 0) as inflow,
    coalesce(sum(case when t.type='expense' then t.amount end), 0) as outflow,
    coalesce(sum(case when t.type='income' then t.amount else -t.amount end), 0) as day_balance
  from base b
  left join public.transactions t on t.due_date = b.day
  group by b.day
  order by b.day;
$$;

create or replace function public.fn_total_balance()
returns numeric
language sql
stable
as $$
  select coalesce(sum(initial_balance), 0) + coalesce((
    select sum(case when type='income' then amount else -amount end)
    from public.transactions
    where payment_date is not null
  ), 0)
  from public.accounts where active;
$$;

-- =========================================================
-- updated_at TRIGGERS
-- =========================================================
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  for t in select unnest(array['profiles','categories','accounts','recurrences','transactions']) loop
    execute format('create trigger tg_%I_upd before update on public.%I for each row execute function public.tg_set_updated_at();', t, t);
  end loop;
end$$;

-- =========================================================
-- PERFORMANCE INDEXES
-- =========================================================
create index if not exists idx_recurrences_active_next on public.recurrences (active, next_run);

-- =========================================================
-- RLS
-- =========================================================
alter table public.allowed_emails enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.accounts enable row level security;
alter table public.recurrences enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','member'));
$$;

-- allowed_emails: admin only
create policy "ae_admin_all" on public.allowed_emails for all
  using (public.is_admin()) with check (public.is_admin());

-- Profiles: each user sees their own; admin sees all
create policy "prof_self_select" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
create policy "prof_self_update" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "prof_admin_all" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- Financial data: any authenticated profile reads; member/admin write
create policy "cat_read" on public.categories for select using (auth.uid() is not null);
create policy "cat_write" on public.categories for all using (public.is_member()) with check (public.is_member());

create policy "acc_read" on public.accounts for select using (auth.uid() is not null);
create policy "acc_write" on public.accounts for all using (public.is_member()) with check (public.is_member());

create policy "rec_read" on public.recurrences for select using (auth.uid() is not null);
create policy "rec_write" on public.recurrences for all using (public.is_member()) with check (public.is_member());

create policy "tr_read" on public.transactions for select using (auth.uid() is not null);
create policy "tr_write" on public.transactions for all using (public.is_member()) with check (public.is_member());

create policy "audit_read_admin" on public.audit_log for select using (public.is_admin());
create policy "audit_insert_auth" on public.audit_log for insert with check (auth.uid() is not null);

-- Grant on the view (inherits RLS from base tables)
grant select on public.v_transactions to authenticated;
