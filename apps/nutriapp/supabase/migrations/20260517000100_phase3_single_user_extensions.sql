-- Phase 3 integration adapted to the existing single-user model.

ALTER TABLE foods_master
  ADD COLUMN IF NOT EXISTS barcode TEXT,
  ADD COLUMN IF NOT EXISTS off_raw JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS foods_master_barcode_source_unique
  ON foods_master (barcode, source)
  WHERE barcode IS NOT NULL;

CREATE TABLE IF NOT EXISTS weight_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logged_at  DATE NOT NULL UNIQUE,
  weight_kg  NUMERIC(5,2) NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
