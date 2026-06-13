/**
 * src/app/api/weight-logs/batch/route.ts
 * POST — importa múltiples registros de peso (onboarding)
 * GET  — lista todos los registros del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface WeightEntry {
  logged_at: string;   // 'YYYY-MM-DD'
  weight_kg: number;
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { entries: WeightEntry[] };
  const entries = (body.entries ?? []).filter(
    e => e.logged_at && typeof e.weight_kg === 'number' && e.weight_kg > 0
  );

  if (entries.length === 0) {
    return NextResponse.json({ message: 'Sin entradas válidas', count: 0 });
  }

  const rows = entries.map(e => ({
    user_id:   session.user.id,
    logged_at: e.logged_at,
    weight_kg: e.weight_kg,
  }));

  const { data, error } = await supabase
    .from('weight_logs')
    .upsert(rows, { onConflict: 'user_id,logged_at' })
    .select('id, logged_at, weight_kg');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ count: data?.length ?? 0, entries: data });
}

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp   = req.nextUrl.searchParams;
  const from = sp.get('from');
  const to   = sp.get('to');

  let query = supabase
    .from('weight_logs')
    .select('id, logged_at, weight_kg, notes')
    .eq('user_id', session.user.id)
    .order('logged_at', { ascending: false });

  if (from) query = query.gte('logged_at', from);
  if (to)   query = query.lte('logged_at', to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// ─── PATCH — añadir/actualizar un registro individual ─────────────────────────

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { logged_at, weight_kg, notes } = await req.json();
  if (!logged_at || typeof weight_kg !== 'number') {
    return NextResponse.json({ error: 'logged_at y weight_kg requeridos' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('weight_logs')
    .upsert({ user_id: session.user.id, logged_at, weight_kg, notes }, { onConflict: 'user_id,logged_at' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
