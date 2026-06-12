# ADR 002: V2 Scraper Constraints — Concurrency, Contracts, and Safety

**Status:** Accepted
**Date:** 2026-03-08
**Context:** Pre-v2 audit surfaced critical contract, concurrency, and operational issues that must be resolved before parallelising the scrape engine.

---

## Context

The current scrape engine runs a single Claude agent per company sequentially (pooled with concurrency 2-4). A v2 redesign aims to run per-source parallel agents for faster, more complete scraping. An audit identified 6 issues (2 critical, 3 high, 1 medium) that would break the system under parallel operation.

## Decisions

### 1. Phase/Source IDs Are Immutable Contracts

**The 6 existing source identifiers are permanent DB/event contracts:**

```
linkedin | companies_house | web_search | financial | community | tech_product
```

These are hardcoded in:
- `scrape-engine.ts` (SCRAPE_SOURCES array, emitPhaseEvents)
- `types.ts` (DataSource union, SCRAPE_SOURCES constant)
- `pipeline-events.ts` (ScrapingPhase type)
- `df_data_points.source` column (production data)
- `df_pipeline_events.phase` column (production data)
- Event timeline UI (badge rendering, phase counters)

**Rules:**
- Never rename existing IDs. New phases get new IDs added to the union.
- If v2 uses friendlier names (e.g. "Known Sources", "Freestyle Research"), those are display-only labels mapped from the canonical IDs.
- Any prompt or plan referencing phases must use the canonical IDs when writing to DB/events.

### 2. INSERT-Only Data Points (No Upsert Under Parallelism)

**Current:** Conflict key `(company_id, field_name, source)` means parallel agents writing the same field+source race, causing nondeterministic loss of `source_url` provenance.

**V2 rule:** Agents INSERT all data points (no ON CONFLICT). Deduplication happens in the TypeScript consolidation layer (`backfillSummaryFields`), not at write time.

- The consolidation query orders by `scraped_at DESC` so most-recent wins deterministically.
- If a confidence column is added later, order by `confidence DESC, scraped_at DESC`.
- Agents write ONLY to `df_data_points`. The `df_companies` summary fields are updated exclusively by the TS orchestrator's `backfillSummaryFields()`.

### 3. Orchestrator Hard Timeout Is Mandatory

**Current:** 5-minute SIGTERM watchdog in `scrape-engine.ts` (line 118).

**V2 rule:** Keep the orchestrator-enforced hard kill. Prompt-level timeout hints ("wrap up at 3m30s") are a graceful optimisation, not a replacement.

- Graceful: prompt hint at T-90s ("start wrapping up")
- Hard: SIGTERM at T+0 (5 min or configured timeout)
- Nuclear: SIGKILL at T+10s if SIGTERM doesn't exit

### 4. Admission Control Before Parallel Agents

**Current:** `bailOut` flag propagates after `out_of_usage` error, but all in-flight agents continue burning until they individually hit the wall.

**V2 rule:** Add admission control before spawning each Claude process:
- **Concurrency cap:** Max 4 concurrent Claude processes (not 8). Revisit after usage data.
- **Pre-flight check:** Before each spawn, check the shared `bailOut` flag. Don't start new work if the flag is set.
- **Stagger delay:** Maintain minimum 2s stagger between process launches to avoid burst pressure.
- **Future:** If the Claude API exposes remaining quota, add a pre-flight quota check.

### 5. Single Guard Session Variable

**The canonical session variable is `app.emit_event_active`.** All migrations must use this name.

Migration 006 had a divergent variable name (`pipeline.bypass_guard`) that was never deployed. Fixed in this commit. The deployed DB functions are consistent.

## Consequences

- V2 can safely parallelise per-source agents without data loss or contract breakage.
- INSERT-only writes trade slightly more DB rows for full provenance history (acceptable at our scale — ~50-100 data points per company).
- Concurrency cap of 4 may slow batch throughput vs theoretical 8, but prevents usage exhaustion cascades.
- Phase/source ID immutability means we carry some legacy naming forever, but UI display labels provide the flexibility we need.
