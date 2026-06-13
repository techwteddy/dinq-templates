// src/lib/nutrition/meal-logs.ts
// ─────────────────────────────────────────────────────────────
// Domain service for meal_logs table.
// Nutrient snapshots are computed at insert time so day summaries
// are always stable even if foods_master data changes later.
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase/server';
import { scaleNutrients } from '@/types/nutrition';
import { classifyConfidence } from '@/lib/nutrition/confidence';
import type { MealLog, MealLogInsert, FoodMaster, Recipe, FoodSource, ConfidenceLevel } from '@/types/nutrition';

// ── Resolve nutrient snapshot for a log entry ──────────────────

async function resolveNutrientSnapshot(
  insert: MealLogInsert
): Promise<{
  snapshot: ReturnType<typeof scaleNutrients>;
  source: FoodSource;
  confidence: ConfidenceLevel;
}> {
  const db = getSupabase();

  if (insert.food_id) {
    const { data: food } = await db
      .from('foods_master')
      .select('*')
      .eq('id', insert.food_id)
      .single();

    if (!food) throw new Error(`Food not found: ${insert.food_id}`);
    const f = food as FoodMaster;
    const factor = insert.grams / 100;
    const source: FoodSource =
      f.source === 'FDC' ? 'FDC' : f.source === 'OFF' ? 'OFF' : 'MANUAL';
    const hasComplete = f.kcal > 0 && f.protein_g > 0 && f.carbs_g > 0 && f.fat_g > 0;

    return {
      snapshot: scaleNutrients(f, factor),
      source,
      confidence: insert.confidence ?? classifyConfidence(source, hasComplete),
    };
  }

  if (insert.recipe_id) {
    const { data: recipe } = await db
      .from('recipes')
      .select('*')
      .eq('id', insert.recipe_id)
      .single();

    if (!recipe) throw new Error(`Recipe not found: ${insert.recipe_id}`);
    const r = recipe as Recipe;

    // Recipes store totals for the whole batch; derive per-100g then scale
    // total_kcal is for the whole recipe weight. We need grams of recipe consumed.
    // For recipe logging, grams = grams of total recipe consumed.
    // We compute total recipe weight as sum of ingredient grams (stored in recipe totals),
    // but we don't have total weight here — so we treat the recipe total as per 100g equiv.
    // The simpler and more practical approach: grams here means "how many grams of the
    // prepared dish" — nutrients are linearly scaled from recipe totals.
    // Recipe totals are for the full yield; we need total yield weight from recipe_ingredients.
    const { data: ingRows } = await db
      .from('recipe_ingredients')
      .select('grams')
      .eq('recipe_id', r.id);

    const totalYieldGrams = (ingRows ?? []).reduce((acc: number, row: { grams: number }) => acc + row.grams, 0) || 100;
    const factor = insert.grams / totalYieldGrams;

    const snapshot = {
      kcal: +((r.total_kcal ?? 0) * factor).toFixed(2),
      protein_g: +((r.total_protein_g ?? 0) * factor).toFixed(2),
      carbs_g: +((r.total_carbs_g ?? 0) * factor).toFixed(2),
      fat_g: +((r.total_fat_g ?? 0) * factor).toFixed(2),
      fiber_g: +((r.total_fiber_g ?? 0) * factor).toFixed(2),
      sugar_g: +((r.total_sugar_g ?? 0) * factor).toFixed(2),
      sodium_mg: +((r.total_sodium_mg ?? 0) * factor).toFixed(2),
      // Micros not aggregated at recipe level
      calcium_mg: null,
      iron_mg: null,
      potassium_mg: null,
      vitamin_c_mg: null,
      vitamin_d_mcg: null,
      vitamin_b12_mcg: null,
      folate_mcg: null,
      magnesium_mg: null,
      zinc_mg: null,
    } as ReturnType<typeof scaleNutrients>;

    return {
      snapshot,
      source: 'RECIPE',
      confidence: insert.confidence ?? 'MEDIUM',
    };
  }

  throw new Error('MealLogInsert must have either food_id or recipe_id');
}

// ── Add meal log ───────────────────────────────────────────────

export async function addMealLog(insert: MealLogInsert): Promise<MealLog> {
  const db = getSupabase();
  const { snapshot, source, confidence } = await resolveNutrientSnapshot(insert);

  const row = {
    meal_date: insert.meal_date,
    meal_type: insert.meal_type,
    food_id: insert.food_id ?? null,
    recipe_id: insert.recipe_id ?? null,
    grams: insert.grams,
    kcal: snapshot.kcal,
    protein_g: snapshot.protein_g,
    carbs_g: snapshot.carbs_g,
    fat_g: snapshot.fat_g,
    fiber_g: snapshot.fiber_g,
    sugar_g: snapshot.sugar_g,
    sodium_mg: snapshot.sodium_mg,
    source,
    confidence,
    notes: insert.notes ?? null,
  };

  const { data, error } = await db.from('meal_logs').insert(row).select(`
    *,
    food:foods_master ( id, name, category ),
    recipe:recipes ( id, name )
  `).single();

  if (error) throw new Error(`Failed to add meal log: ${error.message}`);
  return data as MealLog;
}

// ── Get logs for a date ────────────────────────────────────────

export async function getMealLogsByDate(date: string): Promise<MealLog[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from('meal_logs')
    .select(`
      *,
      food:foods_master ( id, name, category ),
      recipe:recipes ( id, name )
    `)
    .eq('meal_date', date)
    .order('logged_at');

  if (error) throw new Error(`Failed to get meal logs: ${error.message}`);
  return (data ?? []) as MealLog[];
}

// ── Update meal log ────────────────────────────────────────────

export async function updateMealLog(
  id: string,
  update: Partial<Pick<MealLogInsert, 'grams' | 'meal_type' | 'notes' | 'confidence'>>
): Promise<MealLog> {
  const db = getSupabase();

  // If grams changed, recompute nutrient snapshot
  if (update.grams !== undefined) {
    const { data: existing } = await db.from('meal_logs').select('*').eq('id', id).single();
    if (!existing) throw new Error(`Meal log not found: ${id}`);
    const log = existing as MealLog;

    const reinsert: MealLogInsert = {
      meal_date: log.meal_date,
      meal_type: update.meal_type ?? log.meal_type,
      food_id: log.food_id ?? undefined,
      recipe_id: log.recipe_id ?? undefined,
      grams: update.grams,
      confidence: update.confidence ?? log.confidence,
      notes: update.notes ?? log.notes ?? undefined,
    };
    const { snapshot } = await resolveNutrientSnapshot(reinsert);

    const { data, error } = await db
      .from('meal_logs')
      .update({ ...update, kcal: snapshot.kcal, protein_g: snapshot.protein_g, carbs_g: snapshot.carbs_g, fat_g: snapshot.fat_g, fiber_g: snapshot.fiber_g })
      .eq('id', id)
      .select(`*, food:foods_master(id,name,category), recipe:recipes(id,name)`)
      .single();

    if (error) throw new Error(error.message);
    return data as MealLog;
  }

  const { data, error } = await db
    .from('meal_logs')
    .update(update)
    .eq('id', id)
    .select(`*, food:foods_master(id,name,category), recipe:recipes(id,name)`)
    .single();

  if (error) throw new Error(error.message);
  return data as MealLog;
}

// ── Delete meal log ────────────────────────────────────────────

export async function deleteMealLog(id: string): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from('meal_logs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
