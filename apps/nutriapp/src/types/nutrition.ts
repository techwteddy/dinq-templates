// src/types/nutrition.ts
// ─────────────────────────────────────────────────────────────
// Phase 2 — Tracking & Nutrition — Domain types
// ─────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type FoodSource = 'FDC' | 'OFF' | 'MANUAL' | 'RECIPE';
export type ReliabilityFlag = 'RELIABLE' | 'PARTIAL' | 'UNRELIABLE';

// ── Nutrient snapshot (per 100 g) ─────────────────────────────

export interface Nutrients100g {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  // Micros
  calcium_mg: number | null;
  iron_mg: number | null;
  potassium_mg: number | null;
  vitamin_c_mg: number | null;
  vitamin_d_mcg: number | null;
  vitamin_b12_mcg: number | null;
  folate_mcg: number | null;
  magnesium_mg: number | null;
  zinc_mg: number | null;
}

// Helper: scale nutrient snapshot by a factor
export function scaleNutrients(
  n: Nutrients100g,
  factor: number
): Omit<Nutrients100g, 'kcal'> & { kcal: number } {
  return {
    kcal: +(n.kcal * factor).toFixed(2),
    protein_g: +(n.protein_g * factor).toFixed(2),
    carbs_g: +(n.carbs_g * factor).toFixed(2),
    fat_g: +(n.fat_g * factor).toFixed(2),
    fiber_g: n.fiber_g != null ? +(n.fiber_g * factor).toFixed(2) : null,
    sugar_g: n.sugar_g != null ? +(n.sugar_g * factor).toFixed(2) : null,
    sodium_mg: n.sodium_mg != null ? +(n.sodium_mg * factor).toFixed(2) : null,
    calcium_mg: n.calcium_mg != null ? +(n.calcium_mg * factor).toFixed(2) : null,
    iron_mg: n.iron_mg != null ? +(n.iron_mg * factor).toFixed(2) : null,
    potassium_mg: n.potassium_mg != null ? +(n.potassium_mg * factor).toFixed(2) : null,
    vitamin_c_mg: n.vitamin_c_mg != null ? +(n.vitamin_c_mg * factor).toFixed(2) : null,
    vitamin_d_mcg: n.vitamin_d_mcg != null ? +(n.vitamin_d_mcg * factor).toFixed(2) : null,
    vitamin_b12_mcg: n.vitamin_b12_mcg != null ? +(n.vitamin_b12_mcg * factor).toFixed(2) : null,
    folate_mcg: n.folate_mcg != null ? +(n.folate_mcg * factor).toFixed(2) : null,
    magnesium_mg: n.magnesium_mg != null ? +(n.magnesium_mg * factor).toFixed(2) : null,
    zinc_mg: n.zinc_mg != null ? +(n.zinc_mg * factor).toFixed(2) : null,
  };
}

// ── FoodsMaster ────────────────────────────────────────────────

export interface FoodMaster extends Nutrients100g {
  id: string;
  external_id: string | null;
  source: 'FDC' | 'OFF' | 'MANUAL';
  name: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export type FoodMasterInsert = Omit<FoodMaster, 'id' | 'created_at' | 'updated_at'>;

// ── FDC API types ──────────────────────────────────────────────

export interface FdcSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  foodCategory?: string;
  brandOwner?: string;
  foodNutrients?: FdcNutrient[];
}

export interface FdcSearchResponse {
  foods: FdcSearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface FdcNutrient {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
}

export interface FdcFoodDetail {
  fdcId: number;
  description: string;
  dataType: string;
  foodCategory?: string | { description: string };
  foodNutrients: Array<{
    nutrient: { id: number; name: string; unitName: string };
    amount: number;
  }>;
}

// ── Recipes ────────────────────────────────────────────────────

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  food_id: string;
  grams: number;
  food?: Pick<FoodMaster, 'id' | 'name' | 'kcal' | 'protein_g' | 'carbs_g' | 'fat_g'>;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  notes: string | null;
  total_kcal: number | null;
  total_protein_g: number | null;
  total_carbs_g: number | null;
  total_fat_g: number | null;
  total_fiber_g: number | null;
  total_sugar_g: number | null;
  total_sodium_mg: number | null;
  created_at: string;
  updated_at: string;
  ingredients?: RecipeIngredient[];
}

export type RecipeInsert = {
  name: string;
  servings: number;
  notes?: string;
};

export type RecipeIngredientInsert = {
  food_id: string;
  grams: number;
};

// ── MealLog ────────────────────────────────────────────────────

export interface MealLog {
  id: string;
  logged_at: string;
  meal_date: string; // YYYY-MM-DD
  meal_type: MealType;
  food_id: string | null;
  recipe_id: string | null;
  grams: number;
  // Computed snapshot
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  source: FoodSource;
  confidence: ConfidenceLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  food?: Pick<FoodMaster, 'id' | 'name' | 'category'>;
  recipe?: Pick<Recipe, 'id' | 'name'>;
}

export type MealLogInsert = {
  meal_date: string;
  meal_type: MealType;
  food_id?: string;
  recipe_id?: string;
  grams: number;
  confidence?: ConfidenceLevel;
  notes?: string;
};

// ── DaySummary ─────────────────────────────────────────────────

export interface DaySummary {
  id: string;
  summary_date: string;
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  total_sugar_g: number;
  total_sodium_mg: number;
  total_calcium_mg: number | null;
  total_iron_mg: number | null;
  total_potassium_mg: number | null;
  total_vitamin_c_mg: number | null;
  reliability: ReliabilityFlag;
  high_confidence_pct: number | null;
  log_count: number;
  computed_at: string;
}

// ── Habits ─────────────────────────────────────────────────────

export interface HabitItem {
  food_id: string;
  food_name: string;
  grams: number;
}

export interface Habit {
  id: string;
  meal_type: MealType;
  label: string;
  occurrence_count: number;
  last_used_at: string | null;
  items: HabitItem[];
  created_at: string;
  updated_at: string;
}

// ── UI helpers ─────────────────────────────────────────────────

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🫐',
};

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  HIGH: '#22c55e',
  MEDIUM: '#f59e0b',
  LOW: '#ef4444',
};
