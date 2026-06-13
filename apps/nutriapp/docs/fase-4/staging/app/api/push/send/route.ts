/**
 * app/api/push/send/route.ts
 *
 * POST /api/push/send
 * Envía una notificación push al usuario autenticado (todas sus suscripciones).
 * Uso interno / cron jobs.
 *
 * Body: { type: keyof typeof pushTemplates, data?: Record<string, unknown> }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push/web-push";
import { pushTemplates } from "@/lib/push/templates";

// Clave secreta para llamadas desde cron externo (Vercel Cron / GitHub Actions)
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    // ── Autenticación: usuario autenticado O cron secret ──
    const authHeader = request.headers.get("authorization");
    const isCron =
      CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`;

    const supabase = await createClient();
    let userId: string;

    if (isCron) {
      // En cron enviamos a TODOS los usuarios; el body incluye user_id
      const { type, user_id, data } = await request.json();
      userId = user_id;

      return await sendToUser(supabase, userId, type, data);
    } else {
      // Llamada desde el cliente → usuario autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { ok: false, message: "No autenticado." },
          { status: 401 }
        );
      }

      const { type, data } = await request.json();
      return await sendToUser(supabase, user.id, type, data);
    }
  } catch (err) {
    console.error("[push/send] Error:", err);
    return NextResponse.json(
      { ok: false, message: "Error interno." },
      { status: 500 }
    );
  }
}

// ── Helper ───────────────────────────────────────────────────
async function sendToUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  type: keyof typeof pushTemplates,
  data?: Record<string, unknown>
) {
  // 1. Obtener suscripciones activas del usuario
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error || !subs?.length) {
    return NextResponse.json(
      { ok: false, message: "Sin suscripciones activas." },
      { status: 404 }
    );
  }

  // 2. Construir payload
  const templateFn = pushTemplates[type];
  if (!templateFn) {
    return NextResponse.json(
      { ok: false, message: `Tipo de notificación desconocido: ${type}` },
      { status: 400 }
    );
  }
  // @ts-expect-error — argumentos dinámicos según plantilla
  const payload = templateFn(data?.caloriasRestantes ?? data?.dias ?? data);

  // 3. Enviar a todas las suscripciones (múltiples dispositivos)
  const staleEndpoints: string[] = [];
  const results = await Promise.allSettled(
    subs.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );

  // 4. Limpiar suscripciones caducadas (410 Gone)
  results.forEach((result, i) => {
    if (
      result.status === "fulfilled" &&
      !result.value.ok &&
      result.value.status === 410
    ) {
      staleEndpoints.push(subs[i].endpoint);
    }
  });

  if (staleEndpoints.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  const sent = results.filter(
    (r) => r.status === "fulfilled" && (r as PromiseFulfilledResult<{ ok: boolean }>).value.ok
  ).length;

  return NextResponse.json({
    ok: true,
    sent,
    total: subs.length,
    staleRemoved: staleEndpoints.length,
  });
}
