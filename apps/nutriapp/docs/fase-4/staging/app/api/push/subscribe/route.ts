/**
 * app/api/push/subscribe/route.ts
 *
 * POST /api/push/subscribe
 * Guarda la suscripción Web Push del usuario en Supabase.
 *
 * Body: { subscription: PushSubscription.toJSON() }
 * Response: { ok: boolean; message: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription } = body as {
      subscription: {
        endpoint: string;
        expirationTime: number | null;
        keys: { p256dh: string; auth: string };
      };
    };

    if (!subscription?.endpoint || !subscription?.keys?.p256dh) {
      return NextResponse.json(
        { ok: false, message: "Suscripción inválida." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar sesión
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

    // Upsert por endpoint (el mismo endpoint puede renovarse)
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id:         user.id,
        endpoint:        subscription.endpoint,
        expiration_time: subscription.expirationTime,
        p256dh:          subscription.keys.p256dh,
        auth:            subscription.keys.auth,
        user_agent:      request.headers.get("user-agent") ?? null,
        updated_at:      new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    );

    if (error) {
      console.error("[push/subscribe] DB error:", error);
      return NextResponse.json(
        { ok: false, message: "Error al guardar suscripción." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "Suscripción guardada." });
  } catch (err) {
    console.error("[push/subscribe] Error:", err);
    return NextResponse.json(
      { ok: false, message: "Error interno." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ ok: false, message: "Endpoint requerido." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });
    }

    await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);

    return NextResponse.json({ ok: true, message: "Suscripción eliminada." });
  } catch (err) {
    console.error("[push/unsubscribe] Error:", err);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
