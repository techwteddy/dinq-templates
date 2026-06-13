-- =========================================================================
-- AI Response Cache
-- =========================================================================
-- Tiny TTL-backed key/value store for Anthropic responses so we don't re-hit
-- the API for the same (userA, userB) pair on every /search render.
-- Cleared passively via expires_at + an optional periodic cleanup call.
-- =========================================================================

create table if not exists public.ai_cache (
  cache_key   text primary key,
  payload     jsonb not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists ai_cache_expires_idx
  on public.ai_cache (expires_at);

-- RLS: only the service role (server-side actions) may read/write this
-- cache. Clients never touch it directly.
alter table public.ai_cache enable row level security;

drop policy if exists ai_cache_noop_anon on public.ai_cache;
create policy ai_cache_noop_anon on public.ai_cache
  for all to anon using (false) with check (false);

drop policy if exists ai_cache_noop_auth on public.ai_cache;
create policy ai_cache_noop_auth on public.ai_cache
  for all to authenticated using (false) with check (false);

-- Convenience: delete expired rows. Call from a cron / edge function.
create or replace function public.prune_ai_cache()
returns integer language plpgsql as $$
declare
  deleted integer;
begin
  delete from public.ai_cache where expires_at < now();
  get diagnostics deleted = row_count;
  return deleted;
end
$$;
