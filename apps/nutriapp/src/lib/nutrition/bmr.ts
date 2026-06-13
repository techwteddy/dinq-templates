/**
 * Cálculo del BMR (Basal Metabolic Rate) usando la ecuación de Mifflin-St Jeor.
 *
 * Referencia:
 *   Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting energy
 *   expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-247.
 *   https://pmc.ncbi.nlm.nih.gov/articles/PMC6068274/
 *
 * Fórmula:
 *   Hombres: BMR = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) + 5
 *   Mujeres: BMR = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) − 161
 */

import type { UserProfile } from "@/db/types";

/**
 * Calcula el BMR en kcal/día.
 *
 * @param profile - Perfil del usuario (requiere weightKg, heightCm, age, sex).
 * @returns BMR en kcal/día, redondeado a entero.
 */
export function calculateBMR_MifflinStJeor(
  profile: Pick<UserProfile, "weightKg" | "heightCm" | "age" | "sex">
): number {
  const { weightKg, heightCm, age, sex } = profile;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const sexOffset = sex === "male" ? +5 : -161;

  const bmr = base + sexOffset;

  // Nunca devolver un valor negativo o irreal
  return Math.max(Math.round(bmr), 0);
}

// ─── Tests internos (exportados para el script de test) ───────────────────────

export function _testBMR() {
  const cases: Array<{
    input: Parameters<typeof calculateBMR_MifflinStJeor>[0];
    expectedMin: number;
    expectedMax: number;
    label: string;
  }> = [
    {
      label: "Hombre 30 años, 75 kg, 175 cm",
      input: { weightKg: 75, heightCm: 175, age: 30, sex: "male" },
      // 750 + 1093.75 − 150 + 5 = 1698.75 → 1699
      expectedMin: 1690,
      expectedMax: 1710,
    },
    {
      label: "Mujer 28 años, 60 kg, 165 cm",
      input: { weightKg: 60, heightCm: 165, age: 28, sex: "female" },
      // 600 + 1031.25 − 140 − 161 = 1330.25 → 1330
      expectedMin: 1320,
      expectedMax: 1340,
    },
    {
      label: "Hombre 50 años, 90 kg, 180 cm",
      input: { weightKg: 90, heightCm: 180, age: 50, sex: "male" },
      // 900 + 1125 − 250 + 5 = 1780
      expectedMin: 1770,
      expectedMax: 1790,
    },
  ];

  cases.forEach(({ label, input, expectedMin, expectedMax }) => {
    const result = calculateBMR_MifflinStJeor(input);
    const pass = result >= expectedMin && result <= expectedMax;
    console.log(`${pass ? "✅" : "❌"} BMR — ${label}: ${result} kcal`);
    if (!pass) {
      console.error(`   Esperado entre ${expectedMin} y ${expectedMax}`);
    }
  });
}
