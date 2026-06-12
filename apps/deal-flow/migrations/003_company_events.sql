-- Company Events: audit trail for state transitions
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

CREATE TABLE IF NOT EXISTS df_company_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES df_companies(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES df_batches(id) ON DELETE CASCADE,
  event_type text NOT NULL,        -- e.g. 'status_change', 'retry_queued', 'scrape_start', 'scrape_complete', 'scrape_failed'
  from_status text,                -- previous scrape_status
  to_status text,                  -- new scrape_status
  metadata jsonb DEFAULT '{}',     -- extra context (error_message, retry_count, trigger: 'user'/'engine'/'auto_retry')
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_df_company_events_company ON df_company_events(company_id);
CREATE INDEX IF NOT EXISTS idx_df_company_events_batch ON df_company_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_df_company_events_type ON df_company_events(event_type);
CREATE INDEX IF NOT EXISTS idx_df_company_events_created ON df_company_events(created_at DESC);

ALTER TABLE df_company_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on df_company_events" ON df_company_events FOR ALL USING (true);
