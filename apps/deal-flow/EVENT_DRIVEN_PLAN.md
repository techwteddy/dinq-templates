# Event-Driven Pipeline Refactor Plan

## Problem Statement

The deal-flow scraping pipeline uses **mutable status fields** as the source of truth. When a company fails and is retried, the failure history is overwritten. State changes are scattered across the engine, API routes, and retry handlers with no unified audit trail. Debugging requires cross-referencing log files, `df_scrape_runs`, `df_scrape_stages`, and `df_companies.scrape_status` to reconstruct what happened.

At thousands of companies, this is unmaintainable.

## Solution: Event-First Architecture

Flip from status-first to **event-first**. Every state change emits an immutable event. Current status (`scrape_status`) becomes a **derived cache** — updated atomically by the event emitter, but never written directly.

### Core Principle

**Nothing mutates status directly.** Every action emits an event via a single Postgres function `emit_pipeline_event()`. This function inserts the event AND updates the derived status in one transaction. Direct UPDATEs to `scrape_status` are rejected by a database trigger.

---

## Architecture

### Event Table: `df_pipeline_events`

Replaces `df_scrape_runs`, `df_scrape_stages`, and `df_company_events`.

```sql
df_pipeline_events
  id           uuid PK
  company_id   uuid FK (nullable for batch-level events)
  batch_id     uuid FK
  phase        text (nullable: 'linkedin', 'companies_house', etc.)
  event_type   text NOT NULL (closed enum — see below)
  actor        text NOT NULL ('system' | 'user' | 'scraper')
  payload      jsonb DEFAULT '{}'
  run_id       uuid (nullable — groups events in same scrape attempt)
  created_at   timestamptz DEFAULT now()
```

### Event Types

| Event Type | Actor | Status Transition | Payload |
|---|---|---|---|
| `batch.created` | user | - | `{source_url, company_count}` |
| `batch.started` | system | - | `{}` |
| `batch.completed` | system | - | `{success_count, fail_count, avg_completeness}` |
| `batch.paused` | system | - | `{reason}` |
| `company.queued` | system | -> pending | `{}` |
| `company.scrape_started` | system | -> scraping | `{attempt, model, budget_cap, run_id}` |
| `company.phase_started` | system | - | `{phase}` |
| `company.phase_completed` | system | - | `{phase, fields_found, duration_s}` |
| `company.phase_failed` | system | - | `{phase, error}` |
| `company.scrape_completed` | system | -> scraped | `{data_points, completeness, duration_s, run_id}` |
| `company.scrape_failed` | system | -> failed | `{error_type, error, attempt, run_id}` |
| `company.retry_requested` | user | -> retry_queued | `{mode, previous_error}` |
| `company.retry_auto` | system | -> pending | `{attempt, error_type}` |
| `company.rescrape_requested` | user | -> rescrape | `{reason}` |
| `company.data_backfilled` | system | - | `{fields: [...]}` |

### Derived Status

`scrape_status` on `df_companies` is updated by the Postgres function based on event type:

```
company.queued              -> 'pending'
company.scrape_started      -> 'scraping'
company.scrape_completed    -> 'scraped'
company.scrape_failed       -> 'failed'
company.retry_requested     -> 'retry_queued'
company.retry_auto          -> 'pending'
company.rescrape_requested  -> 'rescrape'
```

### Protection: No Direct Status Writes

A Postgres trigger on `df_companies` rejects any UPDATE that changes `scrape_status` unless it comes from the `emit_pipeline_event` function. This makes the discipline problem a database-level guarantee.

---

## Implementation Phases

### Phase 1: Foundation (event system core)

1. **Migration SQL**: Create `df_pipeline_events` table with indexes and RLS
2. **Postgres function**: `emit_pipeline_event()` — atomic event insert + status update
3. **Protection trigger**: Block direct `scrape_status` UPDATEs
4. **TypeScript wrapper**: `emitEvent()` function calling the RPC

### Phase 2: Refactor Scrape Engine

Replace all direct status updates in `scrape-engine.ts` with `emitEvent()` calls:
- `scrapeCompany()`: scrape_started, phase events, scrape_completed/failed
- `finishCompany()`: retry_auto, scrape_completed/failed, batch counter recalc
- Remove `recordRunStart()` / `recordRunEnd()` — replaced by events with run_id
- Remove `logCompanyEvent()` — replaced by emitEvent()
- Replace `fixStuckStages()` with phase event emission
- Remove JSONL log writes — events table is the structured log

### Phase 3: Refactor API Routes

- `/api/batch-retry`: Use emitEvent() instead of direct update + fire-and-forget insert
- `/api/rescrape`: Add emitEvent() (currently emits no events)
- Upload flow: Emit `company.queued` when companies are first inserted

### Phase 4: Drop Old Tables

- Drop `df_scrape_runs` — run data in events with `run_id`
- Drop `df_scrape_stages` — phase data in phase events
- Drop `df_scrape_snapshots` — event log is the audit trail
- Drop `df_company_events` — superseded by `df_pipeline_events`
- Update TypeScript types accordingly

### Phase 5: Event Timeline UI

- `<EventTimeline>` component — vertical timeline per company
- Shows status transitions, phase results, retries, errors
- Realtime subscription to `df_pipeline_events`

### Phase 6: Monitor Dashboard Update

- Subscribe to `df_pipeline_events` via Realtime
- Live phase progress during active scrapes
- Batch health summary derived from events
- Observability queries: phase failure rates, retry effectiveness, duration by phase

---

## What Gets Deleted

| Removed | Replaced By |
|---|---|
| `df_scrape_runs` table | Events with `run_id` in payload |
| `df_scrape_stages` table | Phase events (`company.phase_*`) |
| `df_scrape_snapshots` table | Event history is the audit trail |
| `df_company_events` table | `df_pipeline_events` (superset) |
| `recordRunStart()` / `recordRunEnd()` | `emitEvent()` |
| `logCompanyEvent()` | `emitEvent()` |
| `fixStuckStages()` | Phase event emission post-scrape |
| JSONL log file | Events table (queryable) |

## What Stays

| Kept | Reason |
|---|---|
| `df_scraper_heartbeat` | Operational (is scraper alive?), not historical |
| `df_companies.scrape_status` | Derived cache for fast UI reads |
| Text log files (`run-*.log`, `claude-*.log`) | Full Claude output too large for events table |
| `df_data_points` | Core data, not audit trail |

---

## Con Mitigations

| Risk | Mitigation |
|---|---|
| More Supabase writes | Batch INSERT after scrape; lean payloads (errors truncated to 500 chars) |
| Discipline / bypass | Postgres trigger rejects direct status writes; single emitEvent() function |
| Claude prompt reliability | Orchestrator emits all events; Claude never touches events table |
| Table growth | Index on (company_id, created_at); monthly partitions when needed; retention policy |
| Migration gaps | One-pass refactor; grep lint check for raw scrape_status UPDATEs |
