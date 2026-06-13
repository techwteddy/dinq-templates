// src/app/api/meal-logs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateMealLog, deleteMealLog, getMealLogsByDate } from '@/db/queries/meal-logs';
import { computeAndSaveDaySummary } from '@/db/queries/day-summary';
import { getSupabase } from '@/lib/supabase/server';

// PATCH /api/meal-logs/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const log = await updateMealLog(params.id, body as Parameters<typeof updateMealLog>[1]);
    computeAndSaveDaySummary(log.meal_date).catch(console.error);
    return NextResponse.json(log);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/meal-logs/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get date before deleting for summary recompute
    const db = getSupabase();
    const { data } = await db
      .from('meal_logs')
      .select('meal_date')
      .eq('id', params.id)
      .single();

    await deleteMealLog(params.id);

    if (data?.meal_date) {
      computeAndSaveDaySummary(data.meal_date).catch(console.error);
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
