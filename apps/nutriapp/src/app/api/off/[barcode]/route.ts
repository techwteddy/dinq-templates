import { NextRequest, NextResponse } from "next/server";
import { OFFClient } from "@/lib/off/client";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const db = getSupabase();
  const { barcode } = params;
  const { data: cached } = await db
    .from("foods_master")
    .select("*")
    .eq("barcode", barcode)
    .eq("source", "OFF")
    .maybeSingle();

  if (cached) {
    return NextResponse.json({ product: toBarcodeProduct(cached), from_cache: true });
  }

  const product = await OFFClient.getByBarcode(barcode);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado en Open Food Facts" }, { status: 404 });
  }

  const row = {
    external_id: product.barcode,
    source: "OFF",
    barcode: product.barcode,
    name: product.name,
    category: product.brand ?? null,
    kcal: product.kcal,
    protein_g: product.protein_g,
    carbs_g: product.carbs_g,
    fat_g: product.fat_g,
    fiber_g: product.fiber_g,
    sugar_g: product.sugar_g,
    sodium_mg: product.sodium_mg,
    calcium_mg: product.calcium_mg,
    iron_mg: product.iron_mg,
    potassium_mg: product.potassium_mg,
    vitamin_d_mcg: product.vitamin_d_mcg,
    off_raw: product.raw,
  };
  const { data, error } = await db
    .from("foods_master")
    .upsert(row, { onConflict: "external_id,source" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: toBarcodeProduct(data), from_cache: false });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const body = await req.json();
  const db = getSupabase();
  const updates = {
    ...(body.name ? { name: body.name } : {}),
    ...(body.kcal_per_100g !== undefined ? { kcal: body.kcal_per_100g } : {}),
    ...(body.protein_g !== undefined ? { protein_g: body.protein_g } : {}),
    ...(body.carbs_g !== undefined ? { carbs_g: body.carbs_g } : {}),
    ...(body.fat_g !== undefined ? { fat_g: body.fat_g } : {}),
    ...(body.fiber_g !== undefined ? { fiber_g: body.fiber_g } : {}),
  };
  const { data, error } = await db
    .from("foods_master")
    .update(updates)
    .eq("barcode", params.barcode)
    .eq("source", "OFF")
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: toBarcodeProduct(data) });
}

function toBarcodeProduct(food: Record<string, any>) {
  return {
    id: food.id,
    name: food.name,
    brand: food.category ?? undefined,
    barcode: food.barcode,
    kcal_per_100g: food.kcal ?? 0,
    protein_g: food.protein_g ?? 0,
    carbs_g: food.carbs_g ?? 0,
    fat_g: food.fat_g ?? 0,
    fiber_g: food.fiber_g ?? 0,
    confidence_level: food.kcal && food.protein_g && food.carbs_g && food.fat_g ? 3 : 1,
    has_missing_macros: !(food.kcal && food.protein_g && food.carbs_g && food.fat_g),
  };
}
