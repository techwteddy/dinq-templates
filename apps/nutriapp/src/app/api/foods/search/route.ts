// src/app/api/foods/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchFoodsWithMeta } from '@/db/queries/food-repository';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  const localOnly = req.nextUrl.searchParams.get('local') === '1';
  const refresh = req.nextUrl.searchParams.get('refresh') === '1';

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  try {
    const result = await searchFoodsWithMeta({ query: q.trim(), localOnly, refresh });
    return NextResponse.json({
      foods: result.foods,
      count: result.foods.length,
      canonicalQuery: result.canonicalQuery,
      source: result.source,
      warning: result.warning,
    });
  } catch (err) {
    console.error('[api/foods/search]', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
