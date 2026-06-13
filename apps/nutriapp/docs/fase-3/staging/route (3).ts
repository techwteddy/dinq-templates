/**
 * src/app/api/export/route.ts
 * GET ?from=YYYY-MM-DD&to=YYYY-MM-DD&format=csv|json
 * Genera y devuelve el archivo de exportación.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { buildCSV, buildJSON, exportFilename, ExportDaySummary } from '@/lib/export';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp     = req.nextUrl.searchParams;
  const from   = sp.get('from') ?? '';
  const to     = sp.get('to')   ?? '';
  const fmt    = (sp.get('format') ?? 'json') as 'csv' | 'json';

  if (!from || !to) {
    return NextResponse.json({ error: 'Parámetros from y to requeridos' }, { status: 400 });
  }

  // 1. Traer summaries
  const { data: summaries, error: sErr } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('summary_date', from)
    .lte('summary_date', to)
    .order('summary_date');

  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });

  // 2. Traer entries con alimentos
  const { data: entries, error: eErr } = await supabase
    .from('diary_entries')
    .select(`
      logged_at,
      meal_label,
      amount_g,
      kcal,
      protein_g,
      carbs_g,
      fat_g,
      fiber_g,
      foods_master (name)
    `)
    .eq('user_id', session.user.id)
    .gte('logged_at', from)
    .lte('logged_at', to + 'T23:59:59')
    .order('logged_at');

  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 500 });

  // 3. Agrupar entries por fecha
  const entryMap: Record<string, ExportDaySummary['entries']> = {};
  for (const e of entries ?? []) {
    const date = e.logged_at.slice(0, 10);
    if (!entryMap[date]) entryMap[date] = [];
    entryMap[date].push({
      date,
      meal:      e.meal_label,
      food:      (e.foods_master as { name: string } | null)?.name ?? '—',
      amount_g:  e.amount_g,
      kcal:      e.kcal,
      protein_g: e.protein_g,
      carbs_g:   e.carbs_g,
      fat_g:     e.fat_g,
      fiber_g:   e.fiber_g,
    });
  }

  // 4. Construir estructura final
  const days: ExportDaySummary[] = (summaries ?? []).map(s => ({
    date:           s.summary_date,
    total_kcal:     s.total_kcal,
    total_protein_g: s.total_protein_g,
    total_carbs_g:  s.total_carbs_g,
    total_fat_g:    s.total_fat_g,
    total_fiber_g:  s.total_fiber_g,
    is_reliable:    s.is_reliable,
    goal_kcal:      s.goal_kcal ?? 2000,
    entries:        entryMap[s.summary_date] ?? [],
  }));

  const filename = exportFilename(from, to, fmt);

  if (fmt === 'csv') {
    const csv = buildCSV(days);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  const json = buildJSON(days, from, to);
  return new NextResponse(JSON.stringify(json, null, 2), {
    status: 200,
    headers: {
      'Content-Type':        'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
