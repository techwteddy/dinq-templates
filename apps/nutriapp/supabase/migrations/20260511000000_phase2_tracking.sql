-- ============================================================
-- Phase 2 — Tracking & Nutrition
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. foods_master
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS foods_master (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id   TEXT,                          -- fdcId from FDC
  source        TEXT NOT NULL DEFAULT 'FDC',   -- 'FDC' | 'MANUAL'
  name          TEXT NOT NULL,
  category      TEXT,
  -- Macros per 100 g
  kcal          NUMERIC(8,2),
  protein_g     NUMERIC(8,2),
  carbs_g       NUMERIC(8,2),
  fat_g         NUMERIC(8,2),
  fiber_g       NUMERIC(8,2),
  sugar_g       NUMERIC(8,2),
  sodium_mg     NUMERIC(8,2),
  -- Key micros per 100 g
  calcium_mg    NUMERIC(8,2),
  iron_mg       NUMERIC(8,2),
  potassium_mg  NUMERIC(8,2),
  vitamin_c_mg  NUMERIC(8,2),
  vitamin_d_mcg NUMERIC(8,2),
  vitamin_b12_mcg NUMERIC(8,2),
  folate_mcg    NUMERIC(8,2),
  magnesium_mg  NUMERIC(8,2),
  zinc_mg       NUMERIC(8,2),
  -- Raw FDC payload (for future enrichment)
  raw_fdc       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT foods_master_external_source_unique UNIQUE (external_id, source)
);

CREATE INDEX IF NOT EXISTS foods_master_name_idx ON foods_master USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS foods_master_source_idx ON foods_master (source);

-- ─────────────────────────────────────────────
-- 2. recipes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recipes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  servings      NUMERIC(6,2) NOT NULL DEFAULT 1,
  notes         TEXT,
  -- Computed totals (per full recipe)
  total_kcal    NUMERIC(10,2),
  total_protein_g NUMERIC(10,2),
  total_carbs_g   NUMERIC(10,2),
  total_fat_g     NUMERIC(10,2),
  total_fiber_g   NUMERIC(10,2),
  total_sugar_g   NUMERIC(10,2),
  total_sodium_mg NUMERIC(10,2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id  UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  food_id    UUID NOT NULL REFERENCES foods_master(id),
  grams      NUMERIC(8,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_idx ON recipe_ingredients (recipe_id);

-- ─────────────────────────────────────────────
-- 3. meal_logs
-- ─────────────────────────────────────────────
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE confidence_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TABLE IF NOT EXISTS meal_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logged_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  meal_date        DATE NOT NULL,
  meal_type        meal_type NOT NULL,
  -- Either food_id OR recipe_id, never both
  food_id          UUID REFERENCES foods_master(id),
  recipe_id        UUID REFERENCES recipes(id),
  -- Grams is always the canonical amount
  grams            NUMERIC(8,2) NOT NULL,
  -- Computed nutrient snapshot (at time of logging)
  kcal             NUMERIC(8,2),
  protein_g        NUMERIC(8,2),
  carbs_g          NUMERIC(8,2),
  fat_g            NUMERIC(8,2),
  fiber_g          NUMERIC(8,2),
  sugar_g          NUMERIC(8,2),
  sodium_mg        NUMERIC(8,2),
  -- Metadata
  source           TEXT NOT NULL DEFAULT 'FDC',   -- 'FDC' | 'MANUAL' | 'RECIPE'
  confidence       confidence_level NOT NULL DEFAULT 'HIGH',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT meal_logs_food_or_recipe CHECK (
    (food_id IS NOT NULL AND recipe_id IS NULL) OR
    (food_id IS NULL AND recipe_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS meal_logs_date_idx ON meal_logs (meal_date);
CREATE INDEX IF NOT EXISTS meal_logs_food_idx  ON meal_logs (food_id);

-- ─────────────────────────────────────────────
-- 4. day_summary
-- ─────────────────────────────────────────────
CREATE TYPE reliability_flag AS ENUM ('RELIABLE', 'PARTIAL', 'UNRELIABLE');

CREATE TABLE IF NOT EXISTS day_summary (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date     DATE UNIQUE NOT NULL,
  -- Aggregated macros
  total_kcal       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_protein_g  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_carbs_g    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_fat_g      NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_fiber_g    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_sugar_g    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_sodium_mg  NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Aggregated micros
  total_calcium_mg    NUMERIC(10,2),
  total_iron_mg       NUMERIC(10,2),
  total_potassium_mg  NUMERIC(10,2),
  total_vitamin_c_mg  NUMERIC(10,2),
  -- Reliability
  reliability      reliability_flag NOT NULL DEFAULT 'RELIABLE',
  high_confidence_pct NUMERIC(5,2),   -- % of kcal from HIGH entries
  log_count        INT NOT NULL DEFAULT 0,
  computed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 5. habits (frequent meals)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_type       meal_type NOT NULL,
  label           TEXT NOT NULL,          -- human-readable, e.g. "Tu desayuno habitual"
  occurrence_count INT NOT NULL DEFAULT 2,
  last_used_at    TIMESTAMPTZ,
  -- Snapshot of the items that form this habit
  items           JSONB NOT NULL,         -- [{food_id, food_name, grams}, ...]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 6. Updated-at triggers
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['foods_master','recipes','meal_logs','habits']
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl, tbl
    );
  END LOOP;
END;
$$;
