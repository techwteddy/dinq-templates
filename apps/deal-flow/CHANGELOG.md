# Changelog

## v0.2.0 — 2026-03-08

### V2 Scraping Engine
- Parallel agent architecture: 3 agents per company (identity, research, signals) running concurrently
- Gap-fill agent spawns automatically when critical fields are missing
- Global semaphore caps concurrent processes at 4 (configurable via `MAX_AGENTS`)
- Per-agent timeouts and cost budgets
- Source contract enforcement: each agent writes only its assigned source IDs

### Event-First Pipeline
- Immutable `df_pipeline_events` table for all state transitions
- `emit_pipeline_event()` RPC for atomic event + status updates
- Guard trigger blocks direct `scrape_status` mutations
- Event timeline UI component with realtime subscriptions

### Enrichment Fields
- Added PE-specific fields: `ownership_status`, `is_saas`, `headcount_growth_6m`, `investors`, `location_city`, `location_country`
- Qualification and scoring fields: `score_growth`, `score_scale`, `score_composite`, `ranking`, `ai_brief`
- Affinity CRM sync fields: `affinity_status`, `affinity_org_id`

### Monitor Dashboard
- Scraper health view with heartbeat tracking
- Batch and company log viewers
- Company diagnostics panel

## v0.1.0 — 2026-03-04

### Initial Release
- Full web app: upload, pipeline dashboard, company detail, results table
- Google OAuth + email authentication via Supabase
- Google Sheets / Drive URL CSV upload with preview
- Realtime pipeline dashboard showing scrape progress
- Company profile page with data points grouped by category
- Results table with sort, filter, search, and CSV export
- V1 scraping engine (single sequential process per company)
- Seed data endpoint with two pre-scraped demo companies
- Dark cockpit theme with violet accent
- Deployed to Vercel
