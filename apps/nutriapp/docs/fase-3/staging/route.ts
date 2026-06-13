/**
 * src/app/api/off/[barcode]/route.ts
 * GET  → busca en OFF, normaliza y hace upsert en foods_master
 * POST → permite override manual de campos cuando los datos de OFF son incompletos
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OFFClient, OFFNormalized } from '@/lib/off-client';

// ─── GET /api/off/[barcode] ───────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { barcode } = params;

  // 1. Buscar en caché local (foods_master) primero
  const { data: cached } = await supabase
    .from('foods_master')
    .select('*')
    .eq('barcode', barcode)
    .eq('source', 'OFF')
    .single();

  if (cached) {
    return NextResponse.json({ product: cached, from_cache: true });
  }

  // 2. Consultar OFF
  const product = await OFFClient.getByBarcode(barcode);

  if (!product) {
    return NextResponse.json(
      { error: 'Producto no encontrado en Open Food Facts', barcode },
      { status: 404 }
    );
  }

  // 3. Upsert en foods_master
  const row = buildFoodsMasterRow(product);
  const { data: upserted, error } = await supabase
    .from('foods_master')
    .upsert(row, { onConflict: 'barcode,source' })
    .select()
    .single();

  if (error) {
    console.error('[OFF upsert]', error);
    // Aunque falle el guardado, devolvemos el producto normalizado
    return NextResponse.json({ product, from_cache: false, save_error: error.message });
  }

  return NextResponse.json({ product: upserted, from_cache: false });
}

// ─── POST /api/off/[barcode] — override manual ────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Partial<OFFNormalized> & { name?: string };
  const { barcode } = params;

  // Sólo actualizar campos que vienen en el body (override parcial)
  const updates: Record<string, unknown> = {};
  if (body.name)              updates.name              = body.name;
  if (body.kcal_per_100g !== undefined) updates.kcal_per_100g = body.kcal_per_100g;
  if (body.protein_g_per_100g !== undefined) updates.protein_g    = body.protein_g_per_100g;
  if (body.carbs_g_per_100g !== undefined)   updates.carbs_g     = body.carbs_g_per_100g;
  if (body.fat_g_per_100g !== undefined)     updates.fat_g       = body.fat_g_per_100g;
  if (body.fiber_g_per_100g !== undefined)   updates.fiber_g     = body.fiber_g_per_100g;
  if (body.serving_size_g !== undefined)     updates.serving_size_g = body.serving_size_g;
  // Cuando hay override manual, subimos confianza a 4
  updates.confidence_level = 4;

  const { data, error } = await supabase
    .from('foods_master')
    .update(updates)
    .eq('barcode', barcode)
    .eq('source', 'OFF')
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildFoodsMasterRow(p: OFFNormalized) {
  return {
    name:              p.name,
    brand:             p.brand,
    source:            'OFF',
    barcode:           p.barcode,
    kcal_per_100g:     p.kcal_per_100g,
    protein_g:         p.protein_g_per_100g,
    carbs_g:           p.carbs_g_per_100g,
    fat_g:             p.fat_g_per_100g,
    fiber_g:           p.fiber_g_per_100g,
    sodium_mg:         p.sodium_mg_per_100g,
    calcium_mg:        p.calcium_mg_per_100g,
    iron_mg:           p.iron_mg_per_100g,
    potassium_mg:      p.potassium_mg_per_100g,
    vitamin_d_mcg:     p.vitamin_d_mcg_per_100g,
    serving_size_g:    p.serving_size_g,
    confidence_level:  p.confidence_level,
    off_raw:           p.off_raw,
  };
}
