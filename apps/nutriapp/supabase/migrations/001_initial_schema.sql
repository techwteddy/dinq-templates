-- ═══════════════════════════════════════════════════════════════════════
-- NutriApp — Migración inicial (Fase 1)
-- Ejecutar en: Supabase Studio → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE sex_enum AS ENUM ('male', 'female');

CREATE TYPE activity_level_enum AS ENUM (
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active'
);

CREATE TYPE goal_enum AS ENUM ('cut', 'maintain', 'bulk');

CREATE TYPE weight_unit_enum AS ENUM ('kg', 'lb');

CREATE TYPE height_unit_enum AS ENUM ('cm', 'in');

-- ─── user_profile ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profile (
  -- UUID fijo del único usuario; se gestiona desde la app.
  id                  UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',

  -- Biométricos
  age                 SMALLINT NOT NULL
                        CHECK (age BETWEEN 10 AND 120),

  sex                 sex_enum NOT NULL,

  height_cm           NUMERIC(5, 1) NOT NULL
                        CHECK (height_cm BETWEEN 100 AND 250),

  weight_kg           NUMERIC(6, 2) NOT NULL
                        CHECK (weight_kg BETWEEN 20 AND 300),

  -- Actividad y objetivo
  activity_level      activity_level_enum NOT NULL,
  goal                goal_enum NOT NULL,

  -- Flags de salud
  is_pregnant         BOOLEAN NOT NULL DEFAULT false,
  is_breastfeeding    BOOLEAN NOT NULL DEFAULT false,
  is_diabetic         BOOLEAN NOT NULL DEFAULT false,
  has_kidney_disease  BOOLEAN NOT NULL DEFAULT false,

  -- Auditoría
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: actualiza updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: tabla visible sólo al usuario autenticado (un único usuario)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Política: cualquier usuario autenticado puede leer y escribir SU perfil.
-- En un setup de un solo usuario, esto es suficiente.
CREATE POLICY "allow_authenticated_all" ON user_profile
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── user_settings ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_settings (
  -- UUID fijo de la única configuración
  id                    UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000002',

  -- Unidades
  weight_unit           weight_unit_enum NOT NULL DEFAULT 'kg',
  height_unit           height_unit_enum NOT NULL DEFAULT 'cm',

  -- Distribución de macros (en %)
  protein_pct           SMALLINT NOT NULL DEFAULT 30
                          CHECK (protein_pct BETWEEN 5 AND 70),
  fat_pct               SMALLINT NOT NULL DEFAULT 30
                          CHECK (fat_pct BETWEEN 5 AND 70),
  carbs_pct             SMALLINT NOT NULL DEFAULT 40
                          CHECK (carbs_pct BETWEEN 5 AND 70),

  -- Restricción: la suma de macros debe ser 100 ± 1 (margen de redondeo)
  CONSTRAINT macro_pct_sum CHECK (
    ABS((protein_pct + fat_pct + carbs_pct) - 100) <= 1
  ),

  -- Límites de déficit/superávit
  max_deficit_kcal      SMALLINT NOT NULL DEFAULT 500
                          CHECK (max_deficit_kcal BETWEEN 100 AND 1000),
  max_surplus_kcal      SMALLINT NOT NULL DEFAULT 300
                          CHECK (max_surplus_kcal BETWEEN 100 AND 600),

  -- Mínimo calórico absoluto (seguridad)
  min_calories_kcal     SMALLINT NOT NULL DEFAULT 1200
                          CHECK (min_calories_kcal BETWEEN 800 AND 2000),

  -- Notificaciones — configuración Fase 4
  notifications_enabled BOOLEAN NOT NULL DEFAULT false,

  -- Auditoría
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_authenticated_all" ON user_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Seed: configuración por defecto ─────────────────────────────────────────
-- Inserta la fila de settings con defaults para que getSettings() siempre
-- encuentre un registro. No inserta user_profile (lo crea el onboarding).

INSERT INTO user_settings (id) VALUES ('00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ─── Comentarios de documentación ────────────────────────────────────────────

COMMENT ON TABLE user_profile IS
  'Perfil biométrico del único usuario de la app.
   Un solo registro con ID fijo 00000000-0000-0000-0000-000000000001.';

COMMENT ON TABLE user_settings IS
  'Preferencias de la app (unidades, macros, límites).
   Un solo registro con ID fijo 00000000-0000-0000-0000-000000000002.';
