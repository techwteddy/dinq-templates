import { translateKoToPt } from "@/lib/translate/ko-to-pt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHARS = 12000;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: unknown };
    const text = typeof body.text === "string" ? body.text : "";
    if (!text.trim()) {
      return Response.json({ translated: "" }, { status: 200 });
    }
    if (text.length > MAX_CHARS) {
      return Response.json(
        { error: `Text exceeds ${MAX_CHARS} characters` },
        { status: 413 }
      );
    }

    const translated = await translateKoToPt(text);
    return Response.json({ translated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Translation failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
