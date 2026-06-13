// src/lib/fdc/client.ts
// ─────────────────────────────────────────────────────────────
// FoodData Central REST client
// Docs: https://fdc.nal.usda.gov/api-guide/
// Base URL: https://api.nal.usda.gov/fdc/v1
// ─────────────────────────────────────────────────────────────

import type { FdcSearchResponse, FdcFoodDetail } from '@/types/nutrition';
import { resolveFoodSearchAlias, sortFoodResultsByRelevance } from '@/lib/nutrition/aliases';

const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export class FdcApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string
  ) {
    super(message);
    this.name = 'FdcApiError';
  }
}

function getApiKey(): string {
  const key = process.env.FDC_API_KEY;
  if (!key) throw new Error('FDC_API_KEY environment variable is not set');
  return key;
}

// ── Search foods ───────────────────────────────────────────────

export interface FdcSearchOptions {
  query: string;
  /** Restrict to Foundation and SR Legacy (most reliable nutrient data) */
  dataType?: ('Foundation' | 'SR Legacy' | 'Branded')[];
  pageSize?: number;
  pageNumber?: number;
}

export async function searchFdcFoods(
  options: FdcSearchOptions
): Promise<FdcSearchResponse> {
  const { query, dataType = ['Foundation', 'SR Legacy'], pageSize = 25, pageNumber = 1 } = options;
  const canonicalQuery = resolveFoodSearchAlias(query);

  const res = await fetch(`${BASE_URL}/foods/search?api_key=${getApiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: canonicalQuery,
      dataType,
      pageSize,
      pageNumber,
      sortBy: 'dataType.keyword',
      sortOrder: 'asc',
      // Only request nutrient fields we need
      nutrients: [
        1008, // Energy (kcal)
        1003, // Protein
        1005, // Carbohydrate
        1004, // Total fat
        1079, // Fiber
        2000, // Total sugars
        1093, // Sodium
        1087, // Calcium
        1089, // Iron
        1092, // Potassium
        1162, // Vitamin C
        1114, // Vitamin D
        1178, // Vitamin B-12
        1177, // Folate
        1090, // Magnesium
        1095, // Zinc
      ],
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour (Next.js fetch cache)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new FdcApiError(`FDC search failed (${res.status})`, res.status, text);
  }

  const data = await res.json() as FdcSearchResponse;
  return {
    ...data,
    foods: sortFoodResultsByRelevance(data.foods ?? [], canonicalQuery),
  };
}

// ── Get food detail ────────────────────────────────────────────

export async function getFdcFoodDetail(fdcId: number): Promise<FdcFoodDetail> {
  const res = await fetch(
    `${BASE_URL}/food/${fdcId}?api_key=${getApiKey()}&format=abridged`,
    {
      next: { revalidate: 86400 }, // Cache detail for 24 hours
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new FdcApiError(`FDC detail failed (${res.status})`, res.status, text);
  }

  return res.json() as Promise<FdcFoodDetail>;
}
