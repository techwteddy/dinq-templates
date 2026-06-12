# Deal Flow — Implementation Plan

## What It Does
Automated PE deal sourcing pipeline. Companies flow from Sales Navigator discovery through enrichment, AI-powered qualification and scoring, to Affinity CRM delivery. The user uploads a spreadsheet — the system scrapes, enriches, qualifies, scores, ranks, and pushes qualified companies to Affinity. Human judgment applied only at review stage.

## Full Pipeline Flow (Matches Infographic)
```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1 — EXTRACT & ENRICH (DONE)                             │
│                                                                 │
│  Google Sheets/Drive URL → Parse CSV → Preview → Start Pipeline │
│    ↓                                                            │
│  Scraping engine (claude -p, sequential per company):           │
│    1. LinkedIn  →  2. Companies House  →  3. Web Search         │
│    →  4. Financial sources                                      │
│    → Data points written to Supabase after each stage           │
│    → Completeness score calculated                              │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 2 — QUALIFY & SCORE (TODO)                               │
│                                                                 │
│  Step A: Pre-Qualification Gate                                 │
│    → Is it SaaS/software? (AI reads website)                    │
│    → Headcount in range?                                        │
│    → Private company? (not acquired/subsidiary/public)          │
│    → Companies that FAIL → marked disqualified, skipped         │
│    → Only qualified companies proceed to scoring                │
│                                                                 │
│  Step B: AI Scoring Engine (5 dimensions, 1-5 each)             │
│    → Growth: headcount growth % (from enriched data)            │
│    → Scale: current employee count (threshold mapping)          │
│    → Capital Efficiency: funding history (bootstrapped=high)    │
│    → Product: AI reads website, moat/innovation assessment      │
│    → Market: AI assigns CH Business Category + scores sector    │
│    → Composite score = weighted average of all 5                │
│    → AI brief: 2-3 sentence reasoning per company              │
│                                                                 │
│  Step C: Ranking Assignment                                     │
│    → Composite score → ranking label:                           │
│      Great | Good | High Ok | Ok | Small & Interesting | Poor   │
│    → Prospect Owner auto-assigned by geography rules            │
│    → Status defaults to "Unqualified" (entry stage)             │
│    → CH Business Category assigned by AI                        │
│    → Source of Deal = batch name / search origin                 │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 3 — CRM DELIVERY (TODO)                                 │
│                                                                 │
│  Push to Affinity CRM via API (11 key fields):                  │
│    → Name, Website, Aa LinkedIn URL                             │
│    → Prospect Owner, Status, Ranking                            │
│    → CH Business Category, Source of Deal                       │
│    → Growth (1-5), Scale (1-5), Capital Efficiency (1-5)        │
│    → Product (1-5), Market (1-5)                                │
│    → Deduplication check before push (by name + website)        │
│    → Only qualified + scored companies pushed                   │
└─────────────────────────────────────────────────────────────────┘
```

**Constraints:**
- One company at a time (end-to-end before next) during scraping
- Scoring runs post-scrape as a batch operation
- Scraping runs via CLI (`scripts/scrape-engine.ts`), not browser API routes
- Affinity push requires Enterprise API key ([Client Contact] has confirmed access)

## Database Schema

### `df_batches`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → auth.users | |
| name | TEXT | Batch label (also used as "Source of Deal") |
| google_sheets_url | TEXT | |
| total_companies | INT | |
| scraped_count | INT DEFAULT 0 | Incremented per company |
| status | TEXT | pending / scraping / complete |
| avg_scrape_seconds | NUMERIC | Running average |
| created_at | TIMESTAMPTZ | |

### `df_companies`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| batch_id | UUID FK → df_batches | |
| user_id | UUID FK → auth.users | |
| name | TEXT | From Sales Nav sheet |
| linkedin_url | TEXT | From Sales Nav sheet |
| website, industry, sub_industry | TEXT | Enriched |
| founded_year | INT | Enriched |
| hq_location, employee_count | TEXT | Enriched |
| employee_growth_pct | NUMERIC | Enriched |
| revenue_estimate, funding_total | TEXT | Enriched |
| ceo_name, description | TEXT | Enriched |
| completeness_score | NUMERIC DEFAULT 0 | 0-100 |
| scrape_status | TEXT | pending / scraping / scraped / failed |
| scrape_started_at | TIMESTAMPTZ | |
| scrape_completed_at | TIMESTAMPTZ | |
| scrape_duration_seconds | NUMERIC | |
| created_at | TIMESTAMPTZ | |
| **qualification_status** | **TEXT** | **pending / qualified / disqualified** |
| **disqualification_reason** | **TEXT** | **Why it failed the gate (e.g. "Not SaaS", "Acquired")** |
| **score_growth** | **SMALLINT** | **1-5** |
| **score_scale** | **SMALLINT** | **1-5** |
| **score_capital_efficiency** | **SMALLINT** | **1-5** |
| **score_product** | **SMALLINT** | **1-5** |
| **score_market** | **SMALLINT** | **1-5** |
| **score_composite** | **NUMERIC** | **Weighted average of 5 dimensions** |
| **ranking** | **TEXT** | **Great / Good / High Ok / Ok / Small & Interesting / Poor** |
| **ai_brief** | **TEXT** | **2-3 sentence AI reasoning** |
| **ch_business_category** | **TEXT** | **Sector label (e.g. "Legal Tech", "Cybersecurity")** |
| **prospect_owner** | **TEXT** | **Auto-assigned by geography** |
| **affinity_status** | **TEXT** | **not_pushed / pushed / push_failed** |
| **affinity_pushed_at** | **TIMESTAMPTZ** | **When pushed to CRM** |
| **affinity_org_id** | **TEXT** | **Affinity org ID after push** |

### `df_data_points`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| company_id | UUID FK → df_companies | |
| category | TEXT | identity / location / size / leadership / financials / digital / market / corporate |
| field_name | TEXT | |
| field_value | TEXT | |
| source | TEXT | linkedin / companies_house / web_search / financial / manual / ai_scoring |
| scraped_at | TIMESTAMPTZ | |
| UNIQUE | | (company_id, field_name, source) |

### `df_scrape_stages`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| company_id | UUID FK → df_companies | |
| source | TEXT | linkedin / companies_house / web_search / financial |
| display_name | TEXT | |
| order_index | INT | 1-4 |
| status | TEXT | pending / running / complete / failed / skipped |
| fields_found | INT DEFAULT 0 | |
| started_at, completed_at | TIMESTAMPTZ | |
| error_message | TEXT | |

### `df_scoring_config` (NEW — stores tunable scoring parameters)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → auth.users | |
| dimension | TEXT | growth / scale / capital_efficiency / product / market |
| weight | NUMERIC | Weight in composite (sum to 1.0) |
| thresholds | JSONB | Mapping rules for 1-5 scoring per dimension |
| updated_at | TIMESTAMPTZ | |
| UNIQUE | | (user_id, dimension) |

### `df_prospect_owners` (NEW — geography → owner mapping)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → auth.users | |
| owner_name | TEXT | e.g. "[Client Director]" |
| geography_rules | JSONB | e.g. `["Europe", "UK", "DACH"]` |
| is_default | BOOLEAN | Fallback owner |
| UNIQUE | | (user_id, owner_name) |

RLS on all tables (user_id). Realtime on batches, companies, stages.

## Pages

| Route | Purpose |
|-------|---------|
| `/upload` | Paste Sheets URL → parse → preview companies → "Start Pipeline" |
| `/pipeline/[batchId]` | Progress bar, company list with 4 stage dots, avg time, ETA, realtime |
| `/companies/[id]` | Full enriched profile by category, source badges, **+ scores, ranking, AI brief** |
| `/results/[batchId]` | Live-building table, sort, filter, CSV export, summary stats, **+ ranking column, score columns, qualification status** |
| **`/scoring`** | **Scoring config: dimension weights, threshold rules, prospect owner mapping** |
| **`/qualify/[batchId]`** | **Qualification review: shows pre-qual gate results, run scoring, review AI briefs, approve/override rankings** |
| **`/push/[batchId]`** | **Affinity push: preview what will be pushed, field mapping, push button, push status per company** |

## Scraping Engine Spec

CLI process: `npx tsx scripts/scrape-engine.ts --batch <id>`

Per company (sequential):
1. Mark `scrape_status = 'scraping'`, record `scrape_started_at`
2. **LinkedIn** (stealth): Navigate to company about page → extract identity, location, size, digital fields
3. **Companies House** (API): Search by name → registration, SIC codes, directors
4. **Web Search** (DuckDuckGo + fallbacks): Funding, headcount, news, website
5. **Financial** (web search): Revenue, ARR, growth, valuation, investors
6. Insert data points into `df_data_points` (upsert on unique constraint)
7. Update `df_companies` summary fields + calculate completeness_score
8. Mark `scrape_status = 'scraped'`, record duration
9. Increment `df_batches.scraped_count`, update `avg_scrape_seconds`

Each stage updates `df_scrape_stages` live (status, fields_found, timestamps).

## Implementation Sequence

### Phase 1: Extract & Enrich (DONE)
| Step | Task | Status |
|------|------|--------|
| 1 | Init repo + configs | DONE |
| 2 | Database migration (4 tables + RLS + realtime + indexes) | DONE |
| 3 | Supabase lib (client/server/admin) + types | DONE |
| 4 | Theme (violet cockpit) + layout + middleware + nav | DONE |
| 5 | Auth (login + OAuth callback) | DONE |
| 6 | Upload page | DONE |
| 7 | Pipeline dashboard | DONE |
| 8 | Company detail page | DONE |
| 9 | Results page | DONE |
| 10 | Scraping engine (CLI) | DONE |
| 11 | Seed demo data (Rogers Capital + Summize) | DONE |
| 12 | Deploy to Vercel | DONE |

### Phase 2: Qualify & Score (TODO)
| Step | Task | Status |
|------|------|--------|
| 13 | DB migration: add scoring/qualification/affinity columns to df_companies + new tables (df_scoring_config, df_prospect_owners) | TODO |
| 14 | Pre-qualification gate logic (API route or CLI script): check SaaS, headcount, private status → mark qualified/disqualified | TODO |
| 15 | AI scoring engine (CLI script): score each qualified company on 5 dimensions (1-5), generate AI brief, compute composite, assign ranking label | TODO |
| 16 | Scoring config page (`/scoring`): set dimension weights, threshold rules, prospect owner geography mapping | TODO |
| 17 | Qualification review page (`/qualify/[batchId]`): show gate results, scores, AI briefs, allow manual override of rankings | TODO |
| 18 | Update results page: add ranking, scores, qualification status columns | TODO |
| 19 | Update company detail page: show scores radar/breakdown, AI brief, ranking badge | TODO |
| 20 | Prospect Owner auto-assignment by geography | TODO |
| 21 | Test with real batch + calibrate scoring thresholds | TODO |

### Phase 3: CRM Delivery (TODO)
| Step | Task | Status |
|------|------|--------|
| 22 | Affinity API integration: auth, org search, org create, list entry create | TODO |
| 23 | Affinity field mapping: map 11 key fields to Affinity list fields | TODO |
| 24 | Deduplication check: search Affinity by name+website before push | TODO |
| 25 | Push page (`/push/[batchId]`): preview, field mapping, push button, status per company | TODO |
| 26 | Push engine: batch push qualified+scored companies to Affinity | TODO |
| 27 | Update company detail: show Affinity sync status, link to Affinity record | TODO |
| 28 | E2E test: full pipeline from upload → scrape → qualify → score → push to Affinity | TODO |

## Verification Checklist

### Phase 1 (DONE)
1. ~~`npm run dev` — app loads, login works~~
2. ~~Paste Google Sheets URL → preview shows companies~~
3. ~~"Start Pipeline" → companies appear in pipeline as pending~~
4. ~~Run scraping CLI → stages update in real-time on dashboard~~
5. ~~Results table builds live as each company finishes~~
6. ~~Click company → full enriched profile with source badges~~
7. ~~CSV export works~~
8. ~~`npx vercel --prod` deploys~~

### Phase 2
9. Pre-qual gate runs on scraped batch → companies marked qualified/disqualified with reasons
10. AI scoring produces 5 dimension scores + composite + ranking + brief for each qualified company
11. Scoring config page lets user adjust weights and thresholds
12. Results page shows ranking badges and score columns
13. Company detail shows score breakdown + AI brief
14. Manual override: user can change ranking, scores are preserved
15. Prospect Owner auto-assigned by geography rules

### Phase 3
16. Affinity push sends 11 key fields per company
17. Deduplication prevents duplicate records in Affinity
18. Push page shows status per company (pushed / failed / skipped)
19. Company detail links to Affinity record after push
20. Full E2E: upload CSV → scrape → qualify → score → push → records appear in Affinity

## Scoring Spec (from [Client Contact]'s deck)

### Dimensions (1-5 each)
| Dimension | Data Source | Scoring Logic |
|-----------|-----------|---------------|
| Growth | `employee_growth_pct` from enriched data | Map % ranges to 1-5 (e.g. >30%=5, 20-30%=4, 10-20%=3, 5-10%=2, <5%=1) |
| Scale | `employee_count` from enriched data | Map headcount ranges (e.g. 200-500=5, 100-200=4, 50-100=3, 20-50=2, <20=1) |
| Capital Efficiency | `funding_total` vs company age/scale | Bootstrapped/low-funded=5, moderate=3-4, over-funded=1-2 |
| Product | AI reads company website | AI assesses moat, innovation, market fit. Needs calibration with [Client Contact] |
| Market | AI categorises into sector | AI assigns CH Business Category + scores sector attractiveness |

### Ranking Labels (from composite score)
| Label | Description |
|-------|-------------|
| Great | Top-tier prospect, strong across all dimensions |
| Good | Strong prospect, minor gaps |
| High Ok | Above average, worth investigating |
| Ok | Average, lower priority |
| Small & Interesting | Below scale threshold but interesting product/market |
| Poor | Does not meet criteria |

### Prospect Owner Geography Rules
| Owner | Geographies |
|-------|-------------|
| [Client Director] | Europe (default) |
| [Client Contact] | UK focus |
| (Configurable) | Other directors as needed |

### Affinity Key Fields (11 fields to push)
| # | Field | Source |
|---|-------|--------|
| 1 | Name | df_companies.name |
| 2 | Website | df_companies.website |
| 3 | Aa LinkedIn URL | df_companies.linkedin_url |
| 4 | Prospect Owner | df_companies.prospect_owner (auto by geography) |
| 5 | Status | "Unqualified" (default entry stage) |
| 6 | Ranking | df_companies.ranking |
| 7 | CH Business Category | df_companies.ch_business_category |
| 8 | Source of Deal | df_batches.name |
| 9 | Growth (1-5) | df_companies.score_growth |
| 10 | Scale (1-5) | df_companies.score_scale |
| 11 | Capital Efficiency (1-5) | df_companies.score_capital_efficiency |
| 12 | Product (1-5) | df_companies.score_product |
| 13 | Market (1-5) | df_companies.score_market |
