# Deal Flow

PE deal sourcing pipeline that uses Claude as the scraper. Upload a list of companies, and Claude autonomously enriches each one using LinkedIn, Companies House, web search, and more — writing 50-70+ structured data points per company into Supabase.

Built as a reusable PE deal sourcing tool.

## How It Works

1. Upload a Google Sheets URL with target companies
2. The scraping engine shells out to `claude -p` for each company
3. Claude uses Chrome Stealth (LinkedIn), WebFetch, WebSearch, and Supabase MCP to research and store data
4. A real-time dashboard shows progress as companies are enriched
5. View enriched company profiles or export to CSV

Cost: ~$0.10-0.30 per company (Sonnet), $0.50 safety cap.

## Stack

- **Frontend:** Next.js 15, React 19, Tailwind 4
- **Database:** Supabase Postgres (realtime subscriptions)
- **Scraping:** Claude Code CLI (`claude -p`) with Chrome Stealth + WebSearch + WebFetch MCP tools
- **Auth:** Supabase Auth (Google OAuth + email)

## Setup

```bash
cp .env.local.example .env.local  # Add Supabase keys
npm install
npm run dev                        # Runs on port 3001
```

## Commands

```bash
npm run dev                                          # Dev server (port 3001)
npx tsx scripts/scrape-engine.ts --company <id>      # Scrape one company
npx tsx scripts/scrape-engine.ts --batch <id>        # Scrape a whole batch
npx tsx scripts/scrape-engine.ts                     # Poll for pending batches (cron)
curl -X POST http://localhost:3001/api/seed          # Seed demo data
npx vercel --prod                                    # Deploy
```

## Data Dimensions

| Dimension | Fields | Weight |
|-----------|--------|--------|
| Identity | name, description, sub_industry, website, founded_year | 15% |
| Location | HQ, country, registered address | 10% |
| Size & Headcount | employee count, growth %, team breakdown | 15% |
| Leadership | CEO, founders, directors | 10% |
| Corporate Structure | registration, SIC codes, legal type | 5% |
| Financials | revenue, funding, valuation, ARR | 20% |
| Digital Presence | social links, tech stack | 5% |
| Market Context | competitors, sub-industry, customers | 20% |
