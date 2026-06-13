import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push/web-push";
import { pushTemplates } from "@/lib/push/templates";

type CronType = "desayuno" | "almuerzo" | "cena" | "cierreDia" | "pesoCorporal";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Push no configurado" }, { status: 501 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const type = req.nextUrl.searchParams.get("type") as CronType | null;
  if (!type || !(type in pushTemplates)) {
    return NextResponse.json({ error: "Tipo de push inválido" }, { status: 400 });
  }
  const db = getSupabase();
  const { data, error } = await db.from("push_subscriptions").select("endpoint,p256dh,auth");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const payload = type === "cierreDia" ? pushTemplates.cierreDia(0) : pushTemplates[type]();
  const results = await Promise.all(
    (data ?? []).map((sub) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );
  return NextResponse.json({ sent: results.filter((r) => r.ok).length, results });
}
