/**
 * Tabla de referencia DRI (Dietary Reference Intakes) del USDA.
 *
 * Fuente: USDA DRI Calculator
 *   https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator
 *
 * Los valores son RDA (Recommended Dietary Allowance) o AI (Adequate Intake)
 * donde no existe RDA. Se usan como referencia en la UI de análisis nutricional
 * (Fase 2+). Aquí se definen como constantes de acceso O(1).
 *
 * Unidades:
 *   - Energía: kcal/día
 *   - Macronutrientes: g/día
 *   - Vitaminas/minerales: µg o mg según corresponda (ver campo `unit`).
 */

import type { Sex, ActivityLevel } from "@/db/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface DRIEntry {
  rda: number | null;  // Recommended Dietary Allowance
  ai: number | null;   // Adequate Intake (cuando no hay RDA)
  ul: number | null;   // Tolerable Upper Intake Level
  unit: string;
}

export type AgeGroup =
  | "9-13"
  | "14-18"
  | "19-30"
  | "31-50"
  | "51-70"
  | "71+";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Mapea una edad numérica al grupo de edad DRI más cercano.
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 14) return "9-13";
  if (age < 19) return "14-18";
  if (age < 31) return "19-30";
  if (age < 51) return "31-50";
  if (age < 71) return "51-70";
  return "71+";
}

// ─── Tabla de macronutrientes AMDR + RDA ──────────────────────────────────────

/**
 * EER (Estimated Energy Requirements) aproximado por grupos de edad/sexo.
 * Basado en niveles de actividad moderada (PAL 1.55).
 * Para uso como referencia; el TDEE calculado con Mifflin-St Jeor es más preciso.
 */
export const EER_REFERENCE: Record<
  Sex,
  Record<AgeGroup, number>
> = {
  male: {
    "9-13":  2279,
    "14-18": 3152,
    "19-30": 3067,
    "31-50": 2893,
    "51-70": 2726,
    "71+":   2514,
  },
  female: {
    "9-13":  2071,
    "14-18": 2368,
    "19-30": 2403,
    "31-50": 2237,
    "51-70": 2100,
    "71+":   1978,
  },
};

// ─── Micronutrientes clave ────────────────────────────────────────────────────

/**
 * DRI de micronutrientes clave para adultos (19-50 años).
 * Se amplía por sexo donde hay diferencia significativa.
 *
 * Fuente: Institute of Medicine / National Academies DRI tables.
 */
export const MICRONUTRIENT_DRI: Record<
  string,
  Record<Sex, DRIEntry>
> = {
  // ─ Vitaminas ─
  vitamin_a: {
    male:   { rda: 900, ai: null, ul: 3000, unit: "µg RAE" },
    female: { rda: 700, ai: null, ul: 3000, unit: "µg RAE" },
  },
  vitamin_c: {
    male:   { rda: 90, ai: null, ul: 2000, unit: "mg" },
    female: { rda: 75, ai: null, ul: 2000, unit: "mg" },
  },
  vitamin_d: {
    male:   { rda: 15, ai: null, ul: 100, unit: "µg" },
    female: { rda: 15, ai: null, ul: 100, unit: "µg" },
  },
  vitamin_e: {
    male:   { rda: 15, ai: null, ul: 1000, unit: "mg" },
    female: { rda: 15, ai: null, ul: 1000, unit: "mg" },
  },
  vitamin_k: {
    male:   { rda: null, ai: 120, ul: null, unit: "µg" },
    female: { rda: null, ai: 90,  ul: null, unit: "µg" },
  },
  folate: {
    male:   { rda: 400, ai: null, ul: 1000, unit: "µg DFE" },
    female: { rda: 400, ai: null, ul: 1000, unit: "µg DFE" },
  },
  vitamin_b12: {
    male:   { rda: 2.4, ai: null, ul: null, unit: "µg" },
    female: { rda: 2.4, ai: null, ul: null, unit: "µg" },
  },

  // ─ Minerales ─
  calcium: {
    male:   { rda: 1000, ai: null, ul: 2500, unit: "mg" },
    female: { rda: 1000, ai: null, ul: 2500, unit: "mg" },
  },
  iron: {
    male:   { rda: 8,  ai: null, ul: 45, unit: "mg" },
    female: { rda: 18, ai: null, ul: 45, unit: "mg" }, // premenopausal
  },
  magnesium: {
    male:   { rda: 400, ai: null, ul: 350, unit: "mg" }, // UL para suplementos
    female: { rda: 310, ai: null, ul: 350, unit: "mg" },
  },
  zinc: {
    male:   { rda: 11, ai: null, ul: 40, unit: "mg" },
    female: { rda: 8,  ai: null, ul: 40, unit: "mg" },
  },
  potassium: {
    male:   { rda: null, ai: 3400, ul: null, unit: "mg" },
    female: { rda: null, ai: 2600, ul: null, unit: "mg" },
  },
  sodium: {
    male:   { rda: null, ai: 1500, ul: 2300, unit: "mg" },
    female: { rda: null, ai: 1500, ul: 2300, unit: "mg" },
  },

  // ─ Macronutrientes / fibra ─
  fiber: {
    male:   { rda: null, ai: 38, ul: null, unit: "g" },
    female: { rda: null, ai: 25, ul: null, unit: "g" },
  },
  protein: {
    male:   { rda: 56, ai: null, ul: null, unit: "g" }, // 0.8 g/kg × 70 kg ref
    female: { rda: 46, ai: null, ul: null, unit: "g" }, // 0.8 g/kg × 57 kg ref
  },
};

/**
 * Obtiene el DRI de un micronutriente para un sexo dado.
 * Devuelve null si el nutriente no está en la tabla.
 */
export function getDRI(nutrient: string, sex: Sex): DRIEntry | null {
  const entry = MICRONUTRIENT_DRI[nutrient];
  if (!entry) return null;
  return entry[sex];
}

/**
 * Calcula la proteína mínima recomendada (0.8 g/kg peso corporal)
 * según DRI para adultos sedentarios.
 * Para atletas o en déficit, puede aumentar a 1.6–2.2 g/kg.
 */
export function getMinProteinG(weightKg: number): number {
  return Math.round(weightKg * 0.8);
}

/**
 * Referencia de actividad para EER.
 * Nota: el TDEE calculado con Mifflin-St Jeor es más preciso que la tabla EER.
 */
export function getReferenceEER(
  sex: Sex,
  age: number
): number {
  const group = getAgeGroup(age);
  return EER_REFERENCE[sex][group];
}
