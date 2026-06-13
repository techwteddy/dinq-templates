// src/lib/nutrition/recipes.ts
// ─────────────────────────────────────────────────────────────
// Domain service for recipes + recipe_ingredients.
// Computes per-recipe and per-serving nutrient totals.
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase/server';
import { scaleNutrients } from '@/types/nutrition';
import type { Recipe, RecipeInsert, RecipeIngredientInsert, FoodMaster } from '@/types/nutrition';

// ── Compute recipe totals from its ingredients ─────────────────

function computeRecipeTotals(
  ingredients: Array<{ food: FoodMaster; grams: number }>
) {
  const totals = {
    total_kcal: 0,
    total_protein_g: 0,
    total_carbs_g: 0,
    total_fat_g: 0,
    total_fiber_g: 0,
    total_sugar_g: 0,
    total_sodium_mg: 0,
  };

  for (const { food, grams } of ingredients) {
    const factor = grams / 100;
    const scaled = scaleNutrients(food, factor);
    totals.total_kcal += scaled.kcal;
    totals.total_protein_g += scaled.protein_g;
    totals.total_carbs_g += scaled.carbs_g;
    totals.total_fat_g += scaled.fat_g;
    totals.total_fiber_g += scaled.fiber_g ?? 0;
    totals.total_sugar_g += scaled.sugar_g ?? 0;
    totals.total_sodium_mg += scaled.sodium_mg ?? 0;
  }

  // Round all
  return Object.fromEntries(
    Object.entries(totals).map(([k, v]) => [k, +v.toFixed(2)])
  );
}

// ── Create recipe ──────────────────────────────────────────────

export async function createRecipe(
  recipe: RecipeInsert,
  ingredients: RecipeIngredientInsert[]
): Promise<Recipe> {
  const db = getSupabase();

  // 1. Fetch food data for each ingredient
  const foodIds = ingredients.map((i) => i.food_id);
  const { data: foods, error: foodsError } = await db
    .from('foods_master')
    .select('*')
    .in('id', foodIds);

  if (foodsError) throw new Error(`Failed to fetch foods: ${foodsError.message}`);

  const foodMap = new Map((foods as FoodMaster[]).map((f) => [f.id, f]));

  const enriched = ingredients.map((i) => {
    const food = foodMap.get(i.food_id);
    if (!food) throw new Error(`Food not found: ${i.food_id}`);
    return { food, grams: i.grams };
  });

  const totals = computeRecipeTotals(enriched);

  // 2. Insert recipe
  const { data: newRecipe, error: recipeError } = await db
    .from('recipes')
    .insert({ ...recipe, ...totals })
    .select()
    .single();

  if (recipeError) throw new Error(`Failed to create recipe: ${recipeError.message}`);

  // 3. Insert ingredients
  const ingredientRows = ingredients.map((i) => ({
    recipe_id: (newRecipe as Recipe).id,
    food_id: i.food_id,
    grams: i.grams,
  }));

  const { error: ingError } = await db.from('recipe_ingredients').insert(ingredientRows);
  if (ingError) throw new Error(`Failed to insert ingredients: ${ingError.message}`);

  return newRecipe as Recipe;
}

// ── Get recipe with ingredients ────────────────────────────────

export async function getRecipe(id: string): Promise<Recipe | null> {
  const db = getSupabase();

  const { data } = await db
    .from('recipes')
    .select(`
      *,
      ingredients:recipe_ingredients (
        id, recipe_id, food_id, grams,
        food:foods_master ( id, name, category, kcal, protein_g, carbs_g, fat_g )
      )
    `)
    .eq('id', id)
    .maybeSingle();

  return data as Recipe | null;
}

// ── List all recipes (summary) ─────────────────────────────────

export async function listRecipes(): Promise<Recipe[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from('recipes')
    .select('id, name, servings, total_kcal, total_protein_g, total_carbs_g, total_fat_g, created_at, updated_at')
    .order('name');

  if (error) throw new Error(`Failed to list recipes: ${error.message}`);
  return (data ?? []) as Recipe[];
}

// ── Update recipe (re-compute totals) ─────────────────────────

export async function updateRecipe(
  id: string,
  recipe: Partial<RecipeInsert>,
  ingredients?: RecipeIngredientInsert[]
): Promise<Recipe> {
  const db = getSupabase();

  if (ingredients) {
    // Delete old ingredients and re-insert
    await db.from('recipe_ingredients').delete().eq('recipe_id', id);

    const foodIds = ingredients.map((i) => i.food_id);
    const { data: foods } = await db.from('foods_master').select('*').in('id', foodIds);
    const foodMap = new Map((foods as FoodMaster[]).map((f) => [f.id, f]));

    const enriched = ingredients.map((i) => ({ food: foodMap.get(i.food_id)!, grams: i.grams }));
    const totals = computeRecipeTotals(enriched);

    const { error: ingErr } = await db.from('recipe_ingredients').insert(
      ingredients.map((i) => ({ recipe_id: id, food_id: i.food_id, grams: i.grams }))
    );
    if (ingErr) throw new Error(ingErr.message);

    const { data, error } = await db
      .from('recipes')
      .update({ ...recipe, ...totals })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Recipe;
  }

  const { data, error } = await db
    .from('recipes')
    .update(recipe)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Recipe;
}

// ── Delete recipe ──────────────────────────────────────────────

export async function deleteRecipe(id: string): Promise<void> {
  const db = getSupabase();
  // recipe_ingredients cascade deletes
  const { error } = await db.from('recipes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Compute per-serving nutrients ──────────────────────────────

export function nutrientsPerServing(recipe: Recipe): {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
} {
  const s = recipe.servings || 1;
  return {
    kcal: +((recipe.total_kcal ?? 0) / s).toFixed(2),
    protein_g: +((recipe.total_protein_g ?? 0) / s).toFixed(2),
    carbs_g: +((recipe.total_carbs_g ?? 0) / s).toFixed(2),
    fat_g: +((recipe.total_fat_g ?? 0) / s).toFixed(2),
  };
}
