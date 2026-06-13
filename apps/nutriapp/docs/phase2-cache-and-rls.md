# Phase 2 cache, alias audit, and RLS notes

## Cache warming

Run locally:

```bash
npm run warm-cache:foods
```

Default terms live in `scripts/food-cache-terms.ts`. Add a new Spanish Peru
term there when it is a food you search often. The script uses the normal
`searchFoodsWithMeta` flow:

- resolves aliases through `src/lib/nutrition/aliases.ts`,
- returns local `foods_master` rows without calling FoodData Central,
- calls FDC only when local cache has no compatible results,
- stops if a rate-limit error is detected and prints pending terms.

You can also run a smaller warm-up:

```bash
npm run warm-cache:foods -- palta arroz pollo
```

## Alias audit

Run:

```bash
npm run audit:aliases
```

For each alias it prints:

- original alias,
- canonical English query,
- first 1-3 local/FDC results,
- FDC id or local id,
- kcal per 100 g.

You can audit only a few terms:

```bash
npm run audit:aliases -- palta camote choclo
```

## Phase 2 RLS audit

Tables created by `supabase/migrations/20260511000000_phase2_tracking.sql`:

- `foods_master`
- `recipes`
- `recipe_ingredients`
- `meal_logs`
- `day_summary`
- `habits`

The local migration does not include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
or policies. If RLS was enabled in the Supabase dashboard, that state is not
represented in the migration yet.

The current app's Phase 2 API routes use the server-side Supabase service role
client in `src/lib/supabase/server.ts`. That means normal Phase 2 reads/writes
go through backend route handlers and bypass RLS. Client components call only
Next.js API routes for Phase 2.

Diagnostic SQL to run manually in Supabase SQL Editor:

```sql
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'foods_master',
    'recipes',
    'recipe_ingredients',
    'meal_logs',
    'day_summary',
    'habits'
  )
order by c.relname;

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'foods_master',
    'recipes',
    'recipe_ingredients',
    'meal_logs',
    'day_summary',
    'habits'
  )
order by tablename, policyname;
```

Minimal policy direction, not applied:

```sql
-- Personal app / backend-only access:
-- Enable RLS on all Phase 2 tables and do not add anon/authenticated policies.
-- Service role backend keeps working; direct browser anon access is blocked.
--
-- alter table public.foods_master enable row level security;
-- alter table public.recipes enable row level security;
-- alter table public.recipe_ingredients enable row level security;
-- alter table public.meal_logs enable row level security;
-- alter table public.day_summary enable row level security;
-- alter table public.habits enable row level security;
```

Multiuser policy direction, not applied:

```sql
-- Requires adding user_id columns first. Do not use this before schema changes.
-- create policy "own rows" on public.meal_logs
--   for all
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);
```

