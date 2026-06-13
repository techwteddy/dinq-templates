/**
 * Cálculo del TDEE (Total Daily Energy Expenditure).
 *
 * Se multiplica el BMR por el factor de actividad de Ainsworth / Harris-Benedict
 * (ampliamente adoptado en nutrición clínica y deportiva).
 *
 * Referencia:
 *   https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator
 */

import type { ActivityLevel } from "@/db/types";

/** Factores de actividad (PAL — Physical Activity Level). */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,    // Sin ejercicio o muy poco, trabajo de escritorio
  light: 1.375,      // Ejercicio ligero 1-3 días/semana
  moderate: 1.55,    // Ejercicio moderado 3-5 días/semana
  active: 1.725,     // Ejercicio intenso 6-7 días/semana
  very_active: 1.9,  // Atleta de alto rendimiento / trabajo físico intenso diario
};

/** Etiquetas legibles en español para la UI. */
export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentario",
  light: "Actividad ligera",
  moderate: "Actividad moderada",
  active: "Muy activo",
  very_active: "Extremadamente activo",
};

/** Descripciones de ayuda para el formulario de onboarding. */
export const ACTIVITY_DESCRIPTIONS: Record<ActivityLevel, string> = {
  sedentary: "Poco o ningún ejercicio, trabajo de oficina",
  light: "Ejercicio ligero 1–3 días por semana",
  moderate: "Ejercicio moderado 3–5 días por semana",
  active: "Ejercicio intenso 6–7 días por semana",
  very_active: "Trabajo físico duro o entrenamiento 2× al día",
};

/**
 * Calcula el TDEE (kcal/día).
 *
 * @param bmr           - BMR en kcal/día (calculado con Mifflin-St Jeor).
 * @param activityLevel - Nivel de actividad del usuario.
 * @returns TDEE en kcal/día, redondeado a entero.
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

// ─── Tests internos ───────────────────────────────────────────────────────────

export function _testTDEE() {
  // BMR hombre 30/75/175 = 1699
  const bmr = 1699;
  const cases: Array<{ level: ActivityLevel; expectedMin: number; expectedMax: number }> = [
    { level: "sedentary", expectedMin: 2030, expectedMax: 2050 },   // 1699 × 1.2 ≈ 2039
    { level: "light",     expectedMin: 2330, expectedMax: 2350 },   // 1699 × 1.375 ≈ 2336
    { level: "moderate",  expectedMin: 2625, expectedMax: 2645 },   // 1699 × 1.55 ≈ 2633
    { level: "active",    expectedMin: 2925, expectedMax: 2945 },   // 1699 × 1.725 ≈ 2931
    { level: "very_active", expectedMin: 3225, expectedMax: 3245 }, // 1699 × 1.9 ≈ 3228
  ];

  cases.forEach(({ level, expectedMin, expectedMax }) => {
    const result = calculateTDEE(bmr, level);
    const pass = result >= expectedMin && result <= expectedMax;
    console.log(`${pass ? "✅" : "❌"} TDEE (${level}): ${result} kcal`);
    if (!pass) {
      console.error(`   Esperado entre ${expectedMin} y ${expectedMax}`);
    }
  });
}
