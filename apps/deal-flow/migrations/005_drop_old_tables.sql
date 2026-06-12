-- Drop old tracking tables replaced by df_pipeline_events
-- Run AFTER 004_pipeline_events.sql and AFTER deploying the refactored code
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
--
-- IMPORTANT: Only run this after verifying the new event system is working.
-- The refactored scrape-engine.ts no longer writes to these tables.

-- Drop old tables
DROP TABLE IF EXISTS df_scrape_runs CASCADE;
DROP TABLE IF EXISTS df_scrape_stages CASCADE;
DROP TABLE IF EXISTS df_scrape_snapshots CASCADE;
DROP TABLE IF EXISTS df_company_events CASCADE;
