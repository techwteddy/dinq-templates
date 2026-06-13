// ─── Enums ────────────────────────────────────────────────────────────────────

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"      // Sin ejercicio / trabajo de escritorio
  | "light"          // Ejercicio ligero 1-3 días/semana
  | "moderate"       // Ejercicio moderado 3-5 días/semana
  | "active"         // Ejercicio intenso 6-7 días/semana
  | "very_active";   // Atleta / trabajo físico muy duro

export type Goal =
  | "cut"            // Déficit calórico (bajar peso)
  | "maintain"       // Mantenimiento
  | "bulk";          // Superávit calórico (ganar masa)

export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "in";

// ─── Flags de salud ───────────────────────────────────────────────────────────

export interface HealthFlags {
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isDiabetic: boolean;
  hasKidneyDisease: boolean;
}

// ─── user_profile ─────────────────────────────────────────────────────────────

/** Fila en Supabase: tabla user_profile */
export interface UserProfileRow {
  id: string;                   // UUID — siempre el mismo (un único usuario)
  age: number;                  // años, 10–120
  sex: Sex;
  height_cm: number;            // almacenado siempre en cm
  weight_kg: number;            // almacenado siempre en kg
  activity_level: ActivityLevel;
  goal: Goal;
  // Flags de salud serializados como columnas booleanas
  is_pregnant: boolean;
  is_breastfeeding: boolean;
  is_diabetic: boolean;
  has_kidney_disease: boolean;
  created_at: string;
  updated_at: string;
}

/** DTO de dominio usado en toda la app */
export interface UserProfile {
  id: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  healthFlags: HealthFlags;
}

// ─── user_settings ────────────────────────────────────────────────────────────

/** Fila en Supabase: tabla user_settings */
export interface UserSettingsRow {
  id: string;                   // UUID — siempre el mismo
  weight_unit: WeightUnit;
  height_unit: HeightUnit;
  // Distribución de macros preferida (% de calorías totales)
  protein_pct: number;          // e.g. 30
  fat_pct: number;              // e.g. 30
  carbs_pct: number;            // e.g. 40  (protein + fat + carbs = 100)
  // Límites personalizados de déficit/superávit
  max_deficit_kcal: number;     // default 500
  max_surplus_kcal: number;     // default 300
  // Calorías mínimas absolutas (seguridad)
  min_calories_kcal: number;    // default 1200 (mujeres) / 1500 (hombres) — se puede ajustar
  // Notificaciones — placheholder Fase 4
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/** DTO de dominio */
export interface UserSettings {
  id: string;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  macroPct: {
    protein: number;
    fat: number;
    carbs: number;
  };
  maxDeficitKcal: number;
  maxSurplusKcal: number;
  minCaloriesKcal: number;
  notificationsEnabled: boolean;
}

// ─── Motor nutricional ────────────────────────────────────────────────────────

export interface NutritionTargets {
  bmr: number;               // kcal/día en reposo
  tdee: number;              // kcal/día con actividad
  targetCalories: number;    // calorías objetivo según goal + límites
  deficit: number;           // negativo = déficit, positivo = superávit
  macros: MacroTargets;
}

export interface MacroTargets {
  proteinG: number;
  fatG: number;
  carbsG: number;
  proteinKcal: number;
  fatKcal: number;
  carbsKcal: number;
}

// ─── Helpers de conversión de unidades ────────────────────────────────────────

export const UNIT_CONVERSIONS = {
  KG_TO_LB: 2.20462,
  LB_TO_KG: 0.453592,
  CM_TO_IN: 0.393701,
  IN_TO_CM: 2.54,
} as const;

export function kgToLb(kg: number): number {
  return +(kg * UNIT_CONVERSIONS.KG_TO_LB).toFixed(1);
}

export function lbToKg(lb: number): number {
  return +(lb * UNIT_CONVERSIONS.LB_TO_KG).toFixed(2);
}

export function cmToIn(cm: number): number {
  return +(cm * UNIT_CONVERSIONS.CM_TO_IN).toFixed(1);
}

export function inToCm(inches: number): number {
  return +(inches * UNIT_CONVERSIONS.IN_TO_CM).toFixed(1);
}

// ─── Constantes de validación ─────────────────────────────────────────────────

export const PROFILE_CONSTRAINTS = {
  AGE: { min: 10, max: 120 },
  HEIGHT_CM: { min: 100, max: 250 },
  WEIGHT_KG: { min: 20, max: 300 },
} as const;

export const SETTINGS_CONSTRAINTS = {
  MAX_DEFICIT_KCAL: { min: 100, max: 1000 },
  MAX_SURPLUS_KCAL: { min: 100, max: 600 },
  MIN_CALORIES_KCAL: { min: 800, max: 2000 },
  MACRO_PCT_PROTEIN: { min: 10, max: 50 },
  MACRO_PCT_FAT: { min: 15, max: 60 },
  MACRO_PCT_CARBS: { min: 10, max: 65 },
} as const;

// ─── Mappers Row ↔ DTO ────────────────────────────────────────────────────────

export function rowToProfile(row: UserProfileRow): UserProfile {
  return {
    id: row.id,
    age: row.age,
    sex: row.sex,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    activityLevel: row.activity_level,
    goal: row.goal,
    healthFlags: {
      isPregnant: row.is_pregnant,
      isBreastfeeding: row.is_breastfeeding,
      isDiabetic: row.is_diabetic,
      hasKidneyDisease: row.has_kidney_disease,
    },
  };
}

export function profileToRow(
  profile: Omit<UserProfile, "id"> & { id?: string }
): Omit<UserProfileRow, "created_at" | "updated_at"> {
  return {
    id: profile.id ?? crypto.randomUUID(),
    age: profile.age,
    sex: profile.sex,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    activity_level: profile.activityLevel,
    goal: profile.goal,
    is_pregnant: profile.healthFlags.isPregnant,
    is_breastfeeding: profile.healthFlags.isBreastfeeding,
    is_diabetic: profile.healthFlags.isDiabetic,
    has_kidney_disease: profile.healthFlags.hasKidneyDisease,
  };
}

export function rowToSettings(row: UserSettingsRow): UserSettings {
  return {
    id: row.id,
    weightUnit: row.weight_unit,
    heightUnit: row.height_unit,
    macroPct: {
      protein: row.protein_pct,
      fat: row.fat_pct,
      carbs: row.carbs_pct,
    },
    maxDeficitKcal: row.max_deficit_kcal,
    maxSurplusKcal: row.max_surplus_kcal,
    minCaloriesKcal: row.min_calories_kcal,
    notificationsEnabled: row.notifications_enabled,
  };
}

export function settingsToRow(
  settings: Omit<UserSettings, "id"> & { id?: string }
): Omit<UserSettingsRow, "created_at" | "updated_at"> {
  return {
    id: settings.id ?? crypto.randomUUID(),
    weight_unit: settings.weightUnit,
    height_unit: settings.heightUnit,
    protein_pct: settings.macroPct.protein,
    fat_pct: settings.macroPct.fat,
    carbs_pct: settings.macroPct.carbs,
    max_deficit_kcal: settings.maxDeficitKcal,
    max_surplus_kcal: settings.maxSurplusKcal,
    min_calories_kcal: settings.minCaloriesKcal,
    notifications_enabled: settings.notificationsEnabled,
  };
}
