import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getVapidPublicKey } from "@/lib/push/web-push";

export async function GET() {
  const publicKey = getVapidPublicKey();
  if (!publicKey) return NextResponse.json({ error: "Push no configurado" }, { status: 501 });
  return NextResponse.json({ publicKey });
}

export async function POST(req: NextRequest) {
  if (!getVapidPublicKey()) return NextResponse.json({ error: "Push no configurado" }, { status: 501 });
  const { subscription } = await req.json();
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
  }
  const db = getSupabase();
  const { error } = await db.from("push_subscriptions").upsert({
    endpoint: subscription.endpoint,
    expiration_time: subscription.expirationTime ?? null,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    user_agent: req.headers.get("user-agent"),
  }, { onConflict: "endpoint" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: "endpoint requerido" }, { status: 400 });
  const db = getSupabase();
  const { error } = await db.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
