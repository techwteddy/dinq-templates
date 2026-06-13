import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const db = getSupabase();
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  let query = db.from("weight_logs").select("id,logged_at,weight_kg,notes").order("logged_at", { ascending: false });
  if (from) query = query.gte("logged_at", from);
  if (to) query = query.lte("logged_at", to);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { entries?: Array<{ logged_at: string; weight_kg: number }> };
  const entries = (body.entries ?? []).filter((entry) => entry.logged_at && entry.weight_kg > 0);
  if (!entries.length) return NextResponse.json({ message: "Sin entradas válidas", count: 0 });
  const db = getSupabase();
  const { data, error } = await db
    .from("weight_logs")
    .upsert(entries, { onConflict: "logged_at" })
    .select("id,logged_at,weight_kg");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data?.length ?? 0, entries: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const { logged_at, weight_kg, notes } = await req.json();
  if (!logged_at || typeof weight_kg !== "number") {
    return NextResponse.json({ error: "logged_at y weight_kg requeridos" }, { status: 400 });
  }
  const db = getSupabase();
  const { data, error } = await db
    .from("weight_logs")
    .upsert({ logged_at, weight_kg, notes }, { onConflict: "logged_at" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
