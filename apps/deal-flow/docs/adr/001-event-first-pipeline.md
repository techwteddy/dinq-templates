# ADR-001: Event-First Pipeline Architecture

**Date:** 2026-03-07
**Status:** Accepted
**Deciders:** Riaan Fourie

## Context

The deal-flow scraping pipeline tracks company state via mutable `scrape_status` fields on `df_companies`, with supplementary data spread across `df_scrape_runs`, `df_scrape_stages`, and `df_scrape_snapshots`. State changes are scattered across the scrape engine, API routes, and retry handlers.

This creates several problems as the system scales to thousands of companies:

1. **Lost history** — When a company is retried, the previous failure state is overwritten. There is no record of "this company failed twice before succeeding."
2. **Forensic debugging** — Understanding what happened requires cross-referencing log files, run rows, stage rows, and status fields across multiple tables.
3. **Stale UI state** — Clicking "Retry Failed" resets status but the UI still shows red until the next scrape completes, because the status field serves double duty as both current state and historical record.
4. **Discipline problem** — Status can be updated from anywhere (engine, API routes, direct SQL). No enforcement that state changes are recorded consistently.
5. **Table sprawl** — Four tables (`df_scrape_runs`, `df_scrape_stages`, `df_scrape_snapshots`, `df_company_events`) partially overlap in purpose.

## Decision

Adopt an **event-first architecture** where:

1. Every state change is recorded as an immutable event in a single `df_pipeline_events` table.
2. `df_companies.scrape_status` becomes a **derived cache** — updated atomically by a Postgres function that also inserts the event.
3. Direct UPDATEs to `scrape_status` are **blocked by a database trigger** — all transitions must go through the event emitter.
4. The old tracking tables (`df_scrape_runs`, `df_scrape_stages`, `df_scrape_snapshots`, `df_company_events`) are dropped and replaced by events.

## Alternatives Considered

### A: Bolt-on event log (keep current architecture, add events alongside)
- Add `df_company_events` table and log events fire-and-forget alongside existing status updates.
- **Rejected because:** Events become a second-class citizen. Nothing enforces consistency. The discipline problem remains — events can be skipped or forgotten. Already partially implemented and proving insufficient.

### B: Full job queue (BullMQ/Redis with per-phase jobs)
- Replace the single `claude -p` call with 6 discrete jobs in a queue, each handling one scraping phase.
- **Rejected because:** Adds significant infrastructure (Redis), increases per-company overhead (6 Claude cold starts), and the primary problem is observability/history, not job scheduling. Can evolve toward this later if needed.

### C: Phase-level orchestration without queue (chosen elements incorporated)
- Split the orchestrator into 6 sequential `claude -p` calls, one per phase.
- **Partially incorporated:** Phase-level events are emitted post-scrape by the orchestrator (based on data point evidence), giving phase visibility without requiring 6 separate Claude invocations.

## Consequences

### Positive
- **Single source of truth** for all state transitions — one table, one query pattern.
- **History preserved** — retries, failures, rescraped all traceable.
- **Debugging simplified** — `SELECT * FROM df_pipeline_events WHERE company_id = X ORDER BY created_at`.
- **UI state accurate** — retry clears red immediately; history available on drill-down.
- **Discipline enforced** — database rejects direct status writes.
- **Table count reduced** — 4 tables replaced by 1.
- **Analytics enabled** — phase failure rates, retry effectiveness, duration breakdowns — all from one table.

### Negative
- **More INSERT operations** — ~15 events per company scrape vs ~3 status updates previously. Negligible at expected volume (tens of thousands of events per batch run).
- **Postgres function complexity** — The `emit_pipeline_event` function contains status derivation logic. Changes to the state machine require updating this function.
- **Migration effort** — One-pass refactor of engine + API routes + monitor dashboard. No gradual migration path (by design — avoids dual-write inconsistency period).

### Risks
- **Table growth** — Append-only events table grows indefinitely. Mitigated by indexes on `(company_id, created_at)` and future monthly partitioning.
- **RPC overhead** — Each event is a Supabase RPC call instead of a direct update. Mitigated by batching phase events post-scrape.

## Implementation

See [EVENT_DRIVEN_PLAN.md](../EVENT_DRIVEN_PLAN.md) for the full phased implementation plan.
