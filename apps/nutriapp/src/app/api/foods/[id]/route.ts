// src/app/api/foods/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFoodByFdcId, getFoodById } from '@/db/queries/food-repository';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // If id is numeric → treat as fdcId, else as UUID
    const isNumeric = /^\d+$/.test(id);
    const food = isNumeric
      ? await getFoodByFdcId(Number(id))
      : await getFoodById(id);

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
