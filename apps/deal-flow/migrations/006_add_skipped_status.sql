-- Add 'company.skipped' event type → 'skipped' status
-- Companies with 'skipped' status won't be picked up by the scraper
-- and won't display as failures in the UI.

CREATE OR REPLACE FUNCTION emit_pipeline_event(
  p_company_id uuid DEFAULT NULL,
  p_batch_id uuid DEFAULT NULL,
  p_phase text DEFAULT NULL,
  p_event_type text DEFAULT 'company.queued',
  p_actor text DEFAULT 'system',
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_run_id text DEFAULT NULL
)
RETURNS uuid
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
    WHEN 'company.skipped'             THEN 'skipped'
    ELSE NULL  -- phase events, batch events, etc. don't change company status
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
