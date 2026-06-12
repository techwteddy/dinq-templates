-- Pipeline Events: event-first architecture for the scraping pipeline
-- Replaces: df_scrape_runs, df_scrape_stages, df_scrape_snapshots, df_company_events
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
--
-- IMPORTANT: Run this BEFORE deploying the refactored scrape-engine.ts

-- ============================================================
-- 1. CREATE THE EVENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS df_pipeline_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES df_companies(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES df_batches(id) ON DELETE CASCADE,
  phase text,                                    -- nullable: 'linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'
  event_type text NOT NULL,                      -- e.g. 'company.scrape_started', 'company.phase_completed'
  actor text NOT NULL DEFAULT 'system',          -- 'system' | 'user' | 'scraper'
  payload jsonb DEFAULT '{}',                    -- structured data per event type
  run_id uuid,                                   -- groups events in same scrape attempt
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Primary query: "show me events for this company in order"
CREATE INDEX IF NOT EXISTS idx_pipeline_events_company_time
  ON df_pipeline_events (company_id, created_at DESC);

-- Batch-level queries
CREATE INDEX IF NOT EXISTS idx_pipeline_events_batch_time
  ON df_pipeline_events (batch_id, created_at DESC);

-- Filter by event type (e.g. "all failures across all companies")
CREATE INDEX IF NOT EXISTS idx_pipeline_events_type
  ON df_pipeline_events (event_type, created_at DESC);

-- Find events by run
CREATE INDEX IF NOT EXISTS idx_pipeline_events_run
  ON df_pipeline_events (run_id) WHERE run_id IS NOT NULL;

-- RLS: service role full access
ALTER TABLE df_pipeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on df_pipeline_events"
  ON df_pipeline_events FOR ALL USING (true);

-- ============================================================
-- 2. EMIT EVENT FUNCTION (atomic: insert event + update status)
-- ============================================================

CREATE OR REPLACE FUNCTION emit_pipeline_event(
  p_company_id uuid,
  p_batch_id uuid,
  p_event_type text,
  p_actor text DEFAULT 'system',
  p_payload jsonb DEFAULT '{}',
  p_phase text DEFAULT NULL,
  p_run_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id uuid;
  v_new_status text;
BEGIN
  -- Determine derived status from event type
  v_new_status := CASE p_event_type
    WHEN 'company.queued'              THEN 'pending'
    WHEN 'company.scrape_started'      THEN 'scraping'
    WHEN 'company.scrape_completed'    THEN 'scraped'
    WHEN 'company.scrape_failed'       THEN 'failed'
    WHEN 'company.retry_requested'     THEN 'retry_queued'
    WHEN 'company.retry_auto'          THEN 'pending'
    WHEN 'company.rescrape_requested'  THEN 'rescrape'
    ELSE NULL  -- phase events, batch events, etc. don't change company status
  END;

  -- Insert the event
  INSERT INTO df_pipeline_events (company_id, batch_id, phase, event_type, actor, payload, run_id)
  VALUES (p_company_id, p_batch_id, p_phase, p_event_type, p_actor, p_payload, p_run_id)
  RETURNING id INTO v_event_id;

  -- Update derived status on df_companies (if this event type triggers a transition)
  IF v_new_status IS NOT NULL AND p_company_id IS NOT NULL THEN
    UPDATE df_companies
    SET scrape_status = v_new_status
    WHERE id = p_company_id;
  END IF;

  RETURN v_event_id;
END;
$$;

-- ============================================================
-- 3. PROTECTION TRIGGER: block direct scrape_status writes
-- ============================================================
-- Any UPDATE to scrape_status must come through emit_pipeline_event().
-- We use a session variable set by the function to allow its writes through.

CREATE OR REPLACE FUNCTION guard_scrape_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow if the change came from emit_pipeline_event (sets this flag)
  IF current_setting('app.emit_event_active', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Allow if scrape_status didn't actually change
  IF OLD.scrape_status IS NOT DISTINCT FROM NEW.scrape_status THEN
    RETURN NEW;
  END IF;

  -- Block direct status change
  RAISE EXCEPTION 'Direct UPDATE to scrape_status is not allowed. Use emit_pipeline_event() instead. Attempted: % -> %', OLD.scrape_status, NEW.scrape_status;
END;
$$;

-- Update emit_pipeline_event to set the session flag before updating
CREATE OR REPLACE FUNCTION emit_pipeline_event(
  p_company_id uuid,
  p_batch_id uuid,
  p_event_type text,
  p_actor text DEFAULT 'system',
  p_payload jsonb DEFAULT '{}',
  p_phase text DEFAULT NULL,
  p_run_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id uuid;
  v_new_status text;
BEGIN
  -- Determine derived status from event type
  v_new_status := CASE p_event_type
    WHEN 'company.queued'              THEN 'pending'
    WHEN 'company.scrape_started'      THEN 'scraping'
    WHEN 'company.scrape_completed'    THEN 'scraped'
    WHEN 'company.scrape_failed'       THEN 'failed'
    WHEN 'company.retry_requested'     THEN 'retry_queued'
    WHEN 'company.retry_auto'          THEN 'pending'
    WHEN 'company.rescrape_requested'  THEN 'rescrape'
    ELSE NULL
  END;

  -- Insert the event
  INSERT INTO df_pipeline_events (company_id, batch_id, phase, event_type, actor, payload, run_id)
  VALUES (p_company_id, p_batch_id, p_phase, p_event_type, p_actor, p_payload, p_run_id)
  RETURNING id INTO v_event_id;

  -- Update derived status on df_companies (if this event type triggers a transition)
  IF v_new_status IS NOT NULL AND p_company_id IS NOT NULL THEN
    -- Set session flag so the guard trigger allows this update
    PERFORM set_config('app.emit_event_active', 'true', true);

    UPDATE df_companies
    SET scrape_status = v_new_status
    WHERE id = p_company_id;

    -- Clear the flag
    PERFORM set_config('app.emit_event_active', 'false', true);
  END IF;

  RETURN v_event_id;
END;
$$;

-- Create the trigger (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_guard_scrape_status'
  ) THEN
    CREATE TRIGGER trg_guard_scrape_status
      BEFORE UPDATE ON df_companies
      FOR EACH ROW
      EXECUTE FUNCTION guard_scrape_status();
  END IF;
END;
$$;

-- ============================================================
-- 4. BATCH EVENT HELPER (for batch-level transitions)
-- ============================================================

CREATE OR REPLACE FUNCTION emit_batch_event(
  p_batch_id uuid,
  p_event_type text,
  p_actor text DEFAULT 'system',
  p_payload jsonb DEFAULT '{}'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO df_pipeline_events (company_id, batch_id, event_type, actor, payload)
  VALUES (NULL, p_batch_id, p_event_type, p_actor, p_payload)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$;

-- ============================================================
-- 5. MIGRATE EXISTING DATA (optional: backfill from old tables)
-- ============================================================
-- Uncomment and run after deploying if you want historical data migrated.
-- This inserts synthetic events from df_scrape_runs.

-- INSERT INTO df_pipeline_events (company_id, batch_id, event_type, actor, payload, created_at)
-- SELECT
--   company_id,
--   batch_id,
--   CASE status
--     WHEN 'success' THEN 'company.scrape_completed'
--     WHEN 'failed' THEN 'company.scrape_failed'
--     WHEN 'timeout' THEN 'company.scrape_failed'
--     ELSE 'company.scrape_started'
--   END,
--   'system',
--   jsonb_build_object(
--     'migrated', true,
--     'error_type', error_type,
--     'error_message', error_message,
--     'data_points_found', data_points_found,
--     'completeness_score', completeness_score,
--     'duration_seconds', duration_seconds
--   ),
--   COALESCE(completed_at, started_at)
-- FROM df_scrape_runs
-- ORDER BY started_at;
