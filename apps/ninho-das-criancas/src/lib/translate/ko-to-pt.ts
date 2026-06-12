const MYMEMORY_CHUNK = 420;

async function translateChunkMyMemory(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|pt`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = (await res.json()) as {
    responseStatus: number;
    responseData?: { translatedText?: string; errorMessage?: string };
  };
  if (data.responseStatus !== 200) {
    throw new Error(
      data.responseData?.errorMessage ?? `MyMemory status ${data.responseStatus}`
    );
  }
  const out = data.responseData?.translatedText;
  if (typeof out !== "string") throw new Error("MyMemory: no translation");
  return out;
}

async function translateChunkDeepL(text: string, authKey: string): Promise<string> {
  const body = new URLSearchParams({
    auth_key: authKey,
    text,
    source_lang: "KO",
    target_lang: "PT-BR",
  });
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL HTTP ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    translations?: { text: string }[];
  };
  const t = data.translations?.[0]?.text;
  if (typeof t !== "string") throw new Error("DeepL: no translation");
  return t;
}

function chunkText(s: string, maxLen: number): string[] {
  const t = s.trim();
  if (t.length <= maxLen) return [t];
  const parts: string[] = [];
  for (let i = 0; i < t.length; i += maxLen) {
    parts.push(t.slice(i, i + maxLen));
  }
  return parts;
}

/**
 * 한국어 → 포르투갈어(브라질).
 * `DEEPL_AUTH_KEY`가 있으면 DeepL 무료 API, 없으면 MyMemory(무료·쿼터 제한).
 */
export async function translateKoToPt(text: string): Promise<string> {
  const trimmed = text;
  if (!trimmed) return "";

  const deeplKey = process.env.DEEPL_AUTH_KEY?.trim();
  const maxChunk = deeplKey ? 12000 : MYMEMORY_CHUNK;

  const chunks = chunkText(trimmed, maxChunk);
  const out: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]!;
    const piece = deeplKey
      ? await translateChunkDeepL(c, deeplKey)
      : await translateChunkMyMemory(c);
    out.push(piece);
    if (!deeplKey && i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return out.join("");
}
