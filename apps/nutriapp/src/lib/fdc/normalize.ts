// src/lib/fdc/normalize.ts
// ─────────────────────────────────────────────────────────────
// Maps FDC API responses → Nutrients100g + FoodMasterInsert
// All nutrients are expressed per 100 g (FDC standard).
// ─────────────────────────────────────────────────────────────

import type {
  FdcFoodDetail,
  FdcSearchResult,
  FoodMasterInsert,
  Nutrients100g,
} from '@/types/nutrition';

// ── Nutrient ID → field mapping ────────────────────────────────
// Source: https://fdc.nal.usda.gov/api-guide/#nutrient-id-list

const NUTRIENT_MAP: Record<number, keyof Nutrients100g> = {
  1008: 'kcal',
  1003: 'protein_g',
  1005: 'carbs_g',
  1004: 'fat_g',
  1079: 'fiber_g',
  2000: 'sugar_g',
  1093: 'sodium_mg',
  1087: 'calcium_mg',
  1089: 'iron_mg',
  1092: 'potassium_mg',
  1162: 'vitamin_c_mg',
  1114: 'vitamin_d_mcg',
  1178: 'vitamin_b12_mcg',
  1177: 'folate_mcg',
  1090: 'magnesium_mg',
  1095: 'zinc_mg',
};

const EMPTY_NUTRIENTS: Nutrients100g = {
  kcal: 0,
  protein_g: 0,
  carbs_g: 0,
  fat_g: 0,
  fiber_g: null,
  sugar_g: null,
  sodium_mg: null,
  calcium_mg: null,
  iron_mg: null,
  potassium_mg: null,
  vitamin_c_mg: null,
  vitamin_d_mcg: null,
  vitamin_b12_mcg: null,
  folate_mcg: null,
  magnesium_mg: null,
  zinc_mg: null,
};

// ── From search result (partial nutrients) ─────────────────────

export function normalizeSearchResult(food: FdcSearchResult): FoodMasterInsert {
  const nutrients = { ...EMPTY_NUTRIENTS };

  for (const n of food.foodNutrients ?? []) {
    const field = NUTRIENT_MAP[n.nutrientId];
    if (field) nutrients[field] = +(n.value ?? 0).toFixed(3) as never;
  }

  return {
    external_id: String(food.fdcId),
    source: 'FDC',
    name: food.description,
    category: food.foodCategory ?? null,
    ...nutrients,
    raw_fdc: food as unknown as Record<string, unknown>,
  } as FoodMasterInsert;
}

// ── From detail endpoint (full nutrients) ──────────────────────

export function normalizeFdcDetail(food: FdcFoodDetail): FoodMasterInsert {
  const nutrients = { ...EMPTY_NUTRIENTS };

  for (const fn of food.foodNutrients) {
    const field = NUTRIENT_MAP[fn.nutrient.id];
    if (field) nutrients[field] = +(fn.amount ?? 0).toFixed(3) as never;
  }

  const category =
    typeof food.foodCategory === 'string'
      ? food.foodCategory
      : food.foodCategory?.description ?? null;

  return {
    external_id: String(food.fdcId),
    source: 'FDC',
    name: food.description,
    category,
    ...nutrients,
    raw_fdc: food as unknown as Record<string, unknown>,
  } as FoodMasterInsert;
}

// ── Confidence inference from source ──────────────────────────

export function inferConfidenceFromSource(
  source: 'FDC' | 'MANUAL'
): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (source === 'FDC') return 'HIGH';
  return 'MEDIUM';
}
