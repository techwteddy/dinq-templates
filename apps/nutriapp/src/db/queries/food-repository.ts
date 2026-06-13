// src/db/queries/food-repository.ts
// ─────────────────────────────────────────────────────────────
// Domain service for foods_master table.
// Handles FDC caching (upsert by external_id+source) and local search.
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase/server';
import { searchFdcFoods, getFdcFoodDetail, FdcApiError } from '@/lib/fdc/client';
import { normalizeSearchResult, normalizeFdcDetail } from '@/lib/fdc/normalize';
import { resolveFoodSearchAlias, sortFoodResultsByRelevance } from '@/lib/nutrition/aliases';
import type { FoodMaster, FoodMasterInsert } from '@/types/nutrition';

const FOOD_SEARCH_SELECT = [
  'id',
  'external_id',
  'source',
  'name',
  'category',
  'kcal',
  'protein_g',
  'carbs_g',
  'fat_g',
  'fiber_g',
  'sugar_g',
  'sodium_mg',
  'calcium_mg',
  'iron_mg',
  'potassium_mg',
  'vitamin_c_mg',
  'vitamin_d_mcg',
  'vitamin_b12_mcg',
  'folate_mcg',
  'magnesium_mg',
  'zinc_mg',
  'created_at',
  'updated_at',
].join(',');

// ── Search (FDC → normalize → cache → return) ─────────────────

export interface FoodSearchOptions {
  query: string;
  /** When true, only search local DB (no FDC call) */
  localOnly?: boolean;
  pageSize?: number;
  /** Use sparingly: bypass local cache and ask FDC again. */
  refresh?: boolean;
}

export interface FoodSearchResult {
  foods: FoodMaster[];
  canonicalQuery: string;
  source: 'local-cache' | 'fdc' | 'local-fallback';
  warning?: string;
}

export async function searchFoods(options: FoodSearchOptions): Promise<FoodMaster[]> {
  const result = await searchFoodsWithMeta(options);
  return result.foods;
}

export async function searchFoodsWithMeta(options: FoodSearchOptions): Promise<FoodSearchResult> {
  const { query, localOnly = false, pageSize = 25, refresh = false } = options;
  const canonicalQuery = resolveFoodSearchAlias(query);
  const db = getSupabase();

  // 1. Full-text search in local DB first
  const { data: local, error: localError } = await db
    .from('foods_master')
    .select(FOOD_SEARCH_SELECT)
    .textSearch('name', canonicalQuery, { type: 'plain', config: 'english' })
    .limit(pageSize);

  if (localError) throw new Error(`Failed to search local foods: ${localError.message}`);

  const localFoods = (local ?? []) as unknown as FoodMaster[];
  const sortedLocalFoods = sortFoodResultsByRelevance(localFoods, canonicalQuery);

  if (localOnly || (sortedLocalFoods.length > 0 && !refresh)) {
    return {
      foods: sortedLocalFoods,
      canonicalQuery,
      source: 'local-cache',
    };
  }

  // 2. Fetch from FDC and cache
  try {
    const fdcResponse = await searchFdcFoods({ query: canonicalQuery, pageSize });
    const normalizedFoods = sortFoodResultsByRelevance(
      fdcResponse.foods,
      canonicalQuery
    ).map(normalizeSearchResult);

    // Upsert all found foods into local cache
    if (normalizedFoods.length > 0) {
      const { error: upsertError } = await db
        .from('foods_master')
        .upsert(normalizedFoods, { onConflict: 'external_id,source', ignoreDuplicates: false });
      if (upsertError) throw new Error(`Failed to cache FDC foods: ${upsertError.message}`);
    }

    // Return fresh local search after cache is populated
    const { data: refreshed, error: refreshedError } = await db
      .from('foods_master')
      .select(FOOD_SEARCH_SELECT)
      .textSearch('name', canonicalQuery, { type: 'plain', config: 'english' })
      .limit(pageSize);

    if (refreshedError) throw new Error(`Failed to refresh food search: ${refreshedError.message}`);

    return {
      foods: sortFoodResultsByRelevance((refreshed ?? []) as unknown as FoodMaster[], canonicalQuery),
      canonicalQuery,
      source: 'fdc',
    };
  } catch (err) {
    console.error(
      '[food-repository] FDC search error:',
      err instanceof FdcApiError ? { status: err.status, body: err.body } : err
    );
    const warning = humanizeFdcSearchError(err, sortedLocalFoods.length > 0);

    if (sortedLocalFoods.length === 0) {
      throw new Error(warning);
    }

    return {
      foods: sortedLocalFoods,
      canonicalQuery,
      source: 'local-fallback',
      warning,
    };
  }
}

function humanizeFdcSearchError(err: unknown, hasLocalFallback: boolean): string {
  if (err instanceof FdcApiError && err.status === 429) {
    return hasLocalFallback
      ? 'Usando datos guardados porque se alcanzo el limite de consultas de la base de alimentos.'
      : 'Has alcanzado el limite de consultas de la base de alimentos. Intenta de nuevo en unos minutos.';
  }

  return hasLocalFallback
    ? 'Usando datos guardados porque no se pudo consultar la base de alimentos externa.'
    : 'No pudimos consultar la base de alimentos. Revisa tu conexion o intenta de nuevo mas tarde.';
}

// ── Get or cache a single food by fdcId ───────────────────────

export async function getFoodByFdcId(fdcId: number): Promise<FoodMaster | null> {
  const db = getSupabase();

  // Check cache
  const { data: cached } = await db
    .from('foods_master')
    .select('*')
    .eq('external_id', String(fdcId))
    .eq('source', 'FDC')
    .maybeSingle();

  if (cached) return cached as FoodMaster;

  // Fetch detail from FDC and cache
  const detail = await getFdcFoodDetail(fdcId);
  const normalized = normalizeFdcDetail(detail);

  const { data: inserted, error } = await db
    .from('foods_master')
    .upsert(normalized, { onConflict: 'external_id,source' })
    .select()
    .single();

  if (error) throw new Error(`Failed to cache FDC food ${fdcId}: ${error.message}`);
  return inserted as FoodMaster;
}

// ── Get food by local UUID ─────────────────────────────────────

export async function getFoodById(id: string): Promise<FoodMaster | null> {
  const db = getSupabase();
  const { data } = await db
    .from('foods_master')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data as FoodMaster | null;
}

// ── Create manual food entry ───────────────────────────────────

export async function createManualFood(
  food: Omit<FoodMasterInsert, 'source' | 'external_id'>
): Promise<FoodMaster> {
  const db = getSupabase();
  const { data, error } = await db
    .from('foods_master')
    .insert({ ...food, source: 'MANUAL', external_id: null })
    .select()
    .single();

  if (error) throw new Error(`Failed to create food: ${error.message}`);
  return data as FoodMaster;
}
