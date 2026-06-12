# Deal Flow — Architecture

PE deal sourcing pipeline. Demo-first, extend later.

## Quick Reference
- **Stack**: Next.js 15 + Supabase (`df_` prefixed tables) + Tailwind 4
- **Theme**: Dark cockpit, violet `#8B5CF6`, desktop-first
- **Dev server**: port 3001
- **Plan**: [PLAN.md](PLAN.md) — full implementation roadmap
- **Event plan**: [EVENT_DRIVEN_PLAN.md](EVENT_DRIVEN_PLAN.md) — event-first architecture
- **ADRs**: [docs/adr/](docs/adr/) — architectural decision records

## Commands
```bash
npm run dev                                                  # Dev server (port 3001)
export $(grep -v '^#' .env.local | xargs)                    # Load env vars for scripts

# V1 engine (single process per company, all 6 phases sequential)
npx tsx scripts/scrape-engine.ts --company <id>              # Scrape one company
npx tsx scripts/scrape-engine.ts --batch <id>                # Scrape whole batch
npx tsx scripts/scrape-engine.ts                             # Poll for pending batches

# V2 engine (3 parallel agents per company: identity + research + signals)
npx tsx scripts/scrape-engine-v2.ts --company <id>           # Scrape one company
npx tsx scripts/scrape-engine-v2.ts --batch <id>             # Scrape whole batch
npx tsx scripts/scrape-engine-v2.ts                          # Poll for pending batches

curl -X POST http://localhost:3001/api/seed                  # Seed demo data
npx vitest run                                               # Run tests
```

## Event-First Architecture

All pipeline state transitions go through `df_pipeline_events`. The `scrape_status` field on `df_companies` is a derived cache -- never write to it directly.

**How to change company status:**
```typescript
// Always use the RPC -- never update scrape_status directly
await supabase.rpc('emit_pipeline_event', {
  p_company_id: companyId,
  p_batch_id: batchId,
  p_event_type: 'company.scrape_completed',
  p_actor: 'engine',
  p_payload: { completeness: 85, data_points: 42 },
  p_run_id: runId,
  p_phase: null,
});
```

**Guard trigger:** A Postgres trigger blocks direct UPDATEs to `scrape_status`. Only `emit_pipeline_event()` can change it (via session variable bypass). Metadata fields (timestamps, retry_count, completeness_score) can still be updated directly.

**Event types:**
- Company: `queued`, `scrape_started`, `phase_completed`, `phase_failed`, `scrape_completed`, `scrape_failed`, `retry_requested`, `retry_auto`, `rescrape_requested`, `data_backfilled`
- Batch: `created`, `started`, `completed`, `paused`

**Key files:**
- `src/lib/pipeline-events.ts` -- TypeScript types + `emitEvent()` wrapper
- `src/components/event-timeline.tsx` -- Timeline UI components
- `migrations/004_pipeline_events.sql` -- Table + RPC + guard trigger

## Scraping Architecture

### V2 Engine (Current -- Parallel Agents)

**ADR:** `docs/adr/002-v2-scraper-constraints.md`

3 parallel Claude agents per company, coordinated by `scrape-engine-v2.ts`:

| Agent | Sources | Timeout | Budget | What it does |
|-------|---------|---------|--------|-------------|
| **identity** | `linkedin`, `companies_house` | 2 min | $0.50 | RapidAPI LinkedIn + CH REST API + website |
| **research** | `web_search`, `financial` | 3 min | $1.00 | Freestyle search: funding, revenue, growth, leadership |
| **signals** | `community`, `tech_product` | 2 min | $0.50 | G2, Capterra, Reddit, HN, Product Hunt, GitHub |
| **gapfill** | any | 90s | $0.30 | Spawned only if critical fields missing after above 3 |

**Flow per company:**
1. Orchestrator emits `company.scrape_started` event
2. Spawns 3 agents in parallel (global semaphore caps at 4 concurrent processes)
3. Each agent writes data points to `df_data_points` via Supabase with its assigned source values
4. After all agents complete: consolidation (backfill summary fields), phase events, completeness score
5. If critical fields still missing -> gap-fill agent
6. Emit completion/failure event

**Prompt templates:** `scripts/prompts/{identity,research,signals,gapfill}-agent.md`
**Cron (VPS):** `scripts/cron-scrape-v2-vps.sh` -- every 5 min, polls for pending batches
**Cost:** ~$0.30-0.80 per company (3 agents), $2.00 total cap. Target: 50-70+ data points.

**Key constraints (ADR 002):**
- Source IDs are immutable contracts: `linkedin`, `companies_house`, `web_search`, `financial`, `community`, `tech_product`
- Each agent writes ONLY its assigned sources (no cross-agent conflicts)
- Global semaphore: max 4 concurrent processes (configurable via `MAX_AGENTS` env var)
- Hard timeout per agent (SIGTERM + SIGKILL after 10s)

### V1 Engine (Legacy -- Single Agent)

Single process per company doing all 6 phases sequentially. Still available as `scrape-engine.ts`.
**Prompt template:** `scripts/scrape-prompt.md`

## Project Structure
```
src/app/
  login/             Google OAuth + email
  auth/callback/     OAuth redirect
  upload/            Sheets URL -> parse -> preview -> insert
  pipeline/[batchId] Realtime progress dashboard
  companies/[id]     Enriched company profile + event timeline
  results/[batchId]  Live-building results table + CSV export
  monitor/           Scraper health, batch logs, company diagnostics
  api/seed/          Seed demo data (Rogers Capital + Summize)
  api/batch-retry/   Retry failed companies in a batch
  api/rescrape/      Full rescrape of a single company

src/lib/
  supabase/          client.ts, server.ts, admin.ts
  types.ts           Batch, Company, DataPoint, PipelineEvent
  pipeline-events.ts Event types, emitEvent(), emitBatchEvent()
  export-csv.ts      CSV export utilities (batch + single company)
  database.types.ts  Auto-generated Supabase types
  use-realtime.ts    Realtime subscription hooks (batch, companies, events, heartbeat)

src/components/
  event-timeline.tsx EventTimeline + EventTimelineCompact (realtime)
  nav-bar.tsx        Navigation bar
  batch-list.tsx     Batch listing component

scripts/
  scrape-engine-v2.ts  V2 orchestrator -- parallel agents, global semaphore, gap-fill
  scrape-engine.ts     V1 orchestrator (legacy) -- single process per company
  scrape-prompt.md     V1 prompt template (all 6 phases in one prompt)
  prompts/             V2 per-agent prompt templates
    identity-agent.md  LinkedIn API + Companies House API + website
    research-agent.md  Web search for funding, revenue, growth, leadership
    signals-agent.md   G2, Capterra, Reddit, HN, Product Hunt, GitHub
    gapfill-agent.md   Targeted search for critical missing fields

migrations/
  004_pipeline_events.sql  Event table, emit RPC, guard trigger
  005_drop_old_tables.sql  Drop legacy tables (scrape_runs, scrape_stages, etc.)
```

## Completeness Score

Weighted score across 8 data dimensions, calculated from actual `df_data_points` (not summary fields). Each dimension has an expected number of fields and a weight reflecting PE deal screening importance.

| Dimension | Category | Expected Fields | Weight | Rationale |
|-----------|----------|----------------|--------|-----------|
| Identity | `identity` | 5 | 15% | Company name, description, sub_industry, website, founded_year |
| Location | `location` | 3 | 10% | HQ, country, registered address |
| Size & Headcount | `size` | 4 | 15% | Employee count, growth %, team breakdown |
| Leadership | `leadership` | 3 | 10% | CEO, founders, directors |
| Corporate Structure | `corporate` | 4 | 5% | Registration, SIC codes, legal type |
| Financials | `financials` | 4 | 20% | Revenue, funding, valuation, ARR |
| Digital Presence | `digital` | 3 | 5% | Social links, tech stack |
| Market Context | `market` | 4 | 20% | Competitors, sub-industry, customers |

**Formula:** `score = sum(min(1, fields_found / expected) * weight) * 100`, capped at 100%.

**Post-scrape safety net:** The engine backfills `df_companies` summary fields from data points if the scraper forgot.

## Database Schema

All tables use the `df_` prefix to coexist in a shared Supabase project.

- **`df_batches`** -- Upload batches (name, status, company count)
- **`df_companies`** -- Core company records with summary fields and scrape metadata
- **`df_data_points`** -- Individual data points with category, source, field_name, field_value
- **`df_pipeline_events`** -- Immutable event log (event-sourced state management)

## Conventions
- Server queries: `as { data: Type | null }` type assertions
- Client inserts: `as any` on `.from()` calls (Supabase SSR type inference workaround)
- **Status changes: always via `emit_pipeline_event()` RPC -- never direct UPDATE**
- Data categories: identity, location, size, leadership, financials, digital, market, corporate
- Data sources: linkedin, companies_house, web_search, financial, community, tech_product
- Source badge colors: linkedin=blue, companies_house=emerald, web_search=amber, financial=purple
- Auth credentials in `.env.local` (gitignored)
