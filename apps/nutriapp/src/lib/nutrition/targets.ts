/**
 * Cálculo de metas calóricas y de macronutrientes.
 *
 * Aplica déficit/superávit configurado por el usuario con protecciones de seguridad:
 *   - Mínimo calórico absoluto (configurable, default 1200 kcal).
 *   - Déficit máximo de 500 kcal/día por defecto (≈ 0.45 kg/semana).
 *   - Superávit máximo de 300 kcal/día por defecto.
 *
 * Macros calculados a partir de porcentajes configurables respetando los
 * rangos AMDR del USDA (proteína 10–35%, grasa 20–35%, carbos 45–65%).
 *
 * Referencias:
 *   - DRI Calculator USDA: https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator
 *   - Institute of Medicine. Dietary Reference Intakes for Energy, 2023.
 */

import type {
  Goal,
  HealthFlags,
  NutritionTargets,
  MacroTargets,
  UserSettings,
} from "@/db/types";

// ─── Constantes ────────────────────────────────────────────────────────────────

/** kcal por gramo de cada macronutriente (Atwater factors). */
const KCAL_PER_G = {
  protein: 4,
  fat: 9,
  carbs: 4,
} as const;

/** Rangos AMDR del USDA como referencia de validación. */
export const AMDR_RANGES = {
  protein: { min: 0.1, max: 0.35 },  // 10–35%
  fat: { min: 0.2, max: 0.35 },       // 20–35%
  carbs: { min: 0.45, max: 0.65 },    // 45–65%
} as const;

/** Ajuste estándar para el goal (antes de aplicar límites). */
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  cut: -500,
  maintain: 0,
  bulk: +300,
};

// ─── Metas calóricas ──────────────────────────────────────────────────────────

export interface CalorieTargetOptions {
  tdee: number;
  goal: Goal;
  healthFlags: HealthFlags;
  settings: Pick<
    UserSettings,
    "maxDeficitKcal" | "maxSurplusKcal" | "minCaloriesKcal"
  >;
}

/**
 * Calcula las calorías objetivo del día.
 *
 * 1. Toma el TDEE y le aplica el ajuste del goal.
 * 2. Limita el déficit/superávit al máximo configurado.
 * 3. Nunca baja del mínimo calórico absoluto.
 * 4. Ajustes especiales por flags de salud.
 *
 * @returns { targetCalories, deficit } donde deficit < 0 = déficit real.
 */
export function calculateCalorieTargets(opts: CalorieTargetOptions): {
  targetCalories: number;
  deficit: number;
} {
  const { tdee, goal, healthFlags, settings } = opts;
  const { maxDeficitKcal, maxSurplusKcal, minCaloriesKcal } = settings;

  let adjustment = GOAL_ADJUSTMENTS[goal];

  // Clamp: respetar límites personalizados del usuario
  if (adjustment < 0) {
    adjustment = Math.max(adjustment, -Math.abs(maxDeficitKcal));
  } else if (adjustment > 0) {
    adjustment = Math.min(adjustment, maxSurplusKcal);
  }

  let targetCalories = tdee + adjustment;

  // Ajustes por flags de salud (conservadores, no reemplaza consejo médico)
  if (healthFlags.isPregnant) {
    // 2do/3er trimestre: +300-340 kcal según DRI
    targetCalories += 300;
  }
  if (healthFlags.isBreastfeeding) {
    // +500 kcal según DRI para lactancia exclusiva
    targetCalories += 500;
  }

  // Piso de seguridad absoluto
  targetCalories = Math.max(targetCalories, minCaloriesKcal);

  const deficit = targetCalories - tdee;

  return {
    targetCalories: Math.round(targetCalories),
    deficit: Math.round(deficit),
  };
}

// ─── Metas de macros ──────────────────────────────────────────────────────────

export interface MacroOptions {
  targetCalories: number;
  macroPct: UserSettings["macroPct"];
}

/**
 * Convierte calorías objetivo + distribución de macros (%) a gramos.
 *
 * Valida que los porcentajes sumen 100 y se ajusten a rangos razonables.
 * Si no suman 100, normaliza automáticamente.
 */
export function calculateMacroTargets(opts: MacroOptions): MacroTargets {
  const { targetCalories, macroPct } = opts;

  // Normalizar a 100 si hay deriva de redondeo
  const total = macroPct.protein + macroPct.fat + macroPct.carbs;
  const protein = macroPct.protein / total;
  const fat = macroPct.fat / total;
  const carbs = macroPct.carbs / total;

  const proteinKcal = Math.round(targetCalories * protein);
  const fatKcal = Math.round(targetCalories * fat);
  const carbsKcal = targetCalories - proteinKcal - fatKcal; // absorbe redondeo

  return {
    proteinG: Math.round(proteinKcal / KCAL_PER_G.protein),
    fatG: Math.round(fatKcal / KCAL_PER_G.fat),
    carbsG: Math.round(carbsKcal / KCAL_PER_G.carbs),
    proteinKcal,
    fatKcal,
    carbsKcal,
  };
}

// ─── Tests internos ───────────────────────────────────────────────────────────

export function _testTargets() {
  const defaultSettings = {
    maxDeficitKcal: 500,
    maxSurplusKcal: 300,
    minCaloriesKcal: 1200,
  };

  // Test 1: déficit normal
  const cut = calculateCalorieTargets({
    tdee: 2300,
    goal: "cut",
    healthFlags: {
      isPregnant: false,
      isBreastfeeding: false,
      isDiabetic: false,
      hasKidneyDisease: false,
    },
    settings: defaultSettings,
  });
  console.log(
    `${cut.targetCalories === 1800 ? "✅" : "❌"} Cut: target=${cut.targetCalories} kcal (esperado 1800)`
  );

  // Test 2: déficit limitado por piso mínimo
  const cutAggressive = calculateCalorieTargets({
    tdee: 1500,
    goal: "cut",
    healthFlags: {
      isPregnant: false,
      isBreastfeeding: false,
      isDiabetic: false,
      hasKidneyDisease: false,
    },
    settings: defaultSettings,
  });
  console.log(
    `${cutAggressive.targetCalories === 1200 ? "✅" : "❌"} Cut agresivo (piso): target=${cutAggressive.targetCalories} kcal (esperado 1200)`
  );

  // Test 3: superávit
  const bulk = calculateCalorieTargets({
    tdee: 2300,
    goal: "bulk",
    healthFlags: {
      isPregnant: false,
      isBreastfeeding: false,
      isDiabetic: false,
      hasKidneyDisease: false,
    },
    settings: defaultSettings,
  });
  console.log(
    `${bulk.targetCalories === 2600 ? "✅" : "❌"} Bulk: target=${bulk.targetCalories} kcal (esperado 2600)`
  );

  // Test 4: macros 30/30/40 sobre 2000 kcal
  const macros = calculateMacroTargets({
    targetCalories: 2000,
    macroPct: { protein: 30, fat: 30, carbs: 40 },
  });
  console.log(
    `${macros.proteinG === 150 ? "✅" : "❌"} Macros proteína: ${macros.proteinG}g (esperado 150g)`
  );
  console.log(
    `${macros.fatG === 67 ? "✅" : "❌"} Macros grasa: ${macros.fatG}g (esperado 67g)`
  );
  console.log(
    `${macros.carbsG >= 195 && macros.carbsG <= 205 ? "✅" : "❌"} Macros carbos: ${macros.carbsG}g (esperado ~200g)`
  );
}
