-- ============================================================
-- FASE 3 — Migración: barcode, source, analytics helpers
-- ============================================================

-- 1. Ampliar foods_master con source y barcode
ALTER TABLE foods_master
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'FDC'
    CHECK (source IN ('FDC', 'OFF', 'CUSTOM')),
  ADD COLUMN IF NOT EXISTS barcode TEXT,
  ADD COLUMN IF NOT EXISTS off_raw JSONB;          -- payload original de OFF, sin normalizar

CREATE INDEX IF NOT EXISTS idx_foods_master_barcode
  ON foods_master (barcode)
  WHERE barcode IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_foods_master_source
  ON foods_master (source);

-- Constraint: barcode único por source
CREATE UNIQUE INDEX IF NOT EXISTS idx_foods_master_barcode_source
  ON foods_master (barcode, source)
  WHERE barcode IS NOT NULL;

-- 2. Tabla weight_logs (si no existe en Fase 1/2)
CREATE TABLE IF NOT EXISTS weight_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at   DATE NOT NULL,
  weight_kg   NUMERIC(5, 2) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, logged_at)
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weight_logs: solo propio" ON weight_logs
  FOR ALL USING (auth.uid() = user_id);

-- 3. Vista materializada para resúmenes semanales (refrescada manualmente o via cron)
--    Usa daily_summaries que se asume existente desde Fase 2.
CREATE OR REPLACE VIEW v_week_analytics AS
SELECT
  user_id,
  DATE_TRUNC('week', summary_date)::DATE AS week_start,
  COUNT(*)                               AS days_logged,
  ROUND(AVG(total_kcal)::NUMERIC, 1)    AS avg_kcal,
  ROUND(AVG(total_protein_g)::NUMERIC, 1) AS avg_protein_g,
  ROUND(AVG(total_carbs_g)::NUMERIC, 1) AS avg_carbs_g,
  ROUND(AVG(total_fat_g)::NUMERIC, 1)   AS avg_fat_g,
  SUM(CASE WHEN is_reliable THEN 1 ELSE 0 END) AS reliable_days
FROM daily_summaries
GROUP BY user_id, DATE_TRUNC('week', summary_date);

-- 4. Función helper para exportar diario en JSON
CREATE OR REPLACE FUNCTION export_diary(
  p_user_id  UUID,
  p_from     DATE,
  p_to       DATE
)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT jsonb_agg(
    jsonb_build_object(
      'date',       ds.summary_date,
      'kcal',       ds.total_kcal,
      'protein_g',  ds.total_protein_g,
      'carbs_g',    ds.total_carbs_g,
      'fat_g',      ds.total_fat_g,
      'fiber_g',    ds.total_fiber_g,
      'is_reliable',ds.is_reliable,
      'entries',    (
        SELECT jsonb_agg(
          jsonb_build_object(
            'meal',       de.meal_label,
            'food',       fm.name,
            'amount_g',   de.amount_g,
            'kcal',       de.kcal,
            'protein_g',  de.protein_g,
            'carbs_g',    de.carbs_g,
            'fat_g',      de.fat_g
          ) ORDER BY de.logged_at
        )
        FROM diary_entries de
        JOIN foods_master fm ON fm.id = de.food_id
        WHERE de.user_id = p_user_id
          AND de.logged_at::DATE = ds.summary_date
      )
    ) ORDER BY ds.summary_date
  )
  FROM daily_summaries ds
  WHERE ds.user_id = p_user_id
    AND ds.summary_date BETWEEN p_from AND p_to;
$$;
