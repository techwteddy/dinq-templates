/**
 * app/api/push/cron/route.ts
 *
 * GET /api/push/cron?type=desayuno|almuerzo|cena|cierreDia|pesoCorporal
 *
 * Llamado por Vercel Cron (vercel.json).
 * Requiere header: Authorization: Bearer <CRON_SECRET>
 *
 * Para cierre de día, consulta las calorías restantes del usuario.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push/web-push";
import { pushTemplates } from "@/lib/push/templates";

const CRON_SECRET = process.env.CRON_SECRET ?? "";

export async function GET(request: NextRequest) {
  // ── Verificar secret del cron ──────────────────
  const auth = request.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ ok: false, message: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as
    | "desayuno"
    | "almuerzo"
    | "cena"
    | "cierreDia"
    | "pesoCorporal"
    | null;

  if (!type || !(type in pushTemplates)) {
    return NextResponse.json(
      { ok: false, message: "Parámetro 'type' inválido." },
      { status: 400 }
    );
  }

  // ── Obtener TODOS los usuarios con suscripciones activas ──
  // Usamos el cliente de servicio (service_role) para acceso global
  const supabase = await createClient(); // debe usar service_role en server

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth");

  if (error || !subscriptions?.length) {
    return NextResponse.json({ ok: true, sent: 0, message: "Sin suscripciones." });
  }

  // ── Construir payload por usuario ──────────────
  let sent = 0;
  let failed = 0;
  const staleEndpoints: string[] = [];

  for (const sub of subscriptions) {
    let payload;

    if (type === "cierreDia") {
      // Obtener calorías del día del usuario
      const cals = await getCaloriasRestantes(supabase, sub.user_id);
      payload = pushTemplates.cierreDia(cals);
    } else {
      // @ts-expect-error — plantillas sin args
      payload = pushTemplates[type]();
    }

    const result = await sendPushNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      payload
    );

    if (result.ok) {
      sent++;
    } else {
      failed++;
      if (result.status === 410) {
        staleEndpoints.push(sub.endpoint);
      }
    }
  }

  // Limpiar endpoints caducados
  if (staleEndpoints.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  return NextResponse.json({
    ok: true,
    type,
    sent,
    failed,
    staleRemoved: staleEndpoints.length,
    total: subscriptions.length,
  });
}

// ── Helper: calorías restantes del usuario hoy ────
async function getCaloriasRestantes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string
): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  // 1. Meta calórica del usuario
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tdee, goal_type, goal_kcal_adjustment")
    .eq("user_id", userId)
    .single();

  const metaKcal = profile
    ? (profile.tdee ?? 2000) + (profile.goal_kcal_adjustment ?? 0)
    : 2000;

  // 2. Calorías consumidas hoy
  const { data: summary } = await supabase
    .from("daily_summaries")
    .select("total_kcal")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const consumidas = summary?.total_kcal ?? 0;
  return Math.round(metaKcal - consumidas);
}
