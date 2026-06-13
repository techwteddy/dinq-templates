/**
 * AI layer for Trendly — thin wrapper around Anthropic's Claude used for
 * natural-language match reasons and AI-drafted connect messages.
 *
 * Philosophy (matches the product spec):
 *   AI is NOT the product. Connection is the product.
 *   AI just (1) explains, (2) nudges, (3) accelerates.
 *
 * Everything here:
 *   - Runs server-side only (reads ANTHROPIC_API_KEY from process.env).
 *   - Uses Claude Haiku 4.5 for speed.
 *   - Caches every response in the `ai_cache` Supabase table with a short
 *     TTL (5–15 min) so the same (me, them) pair doesn't re-hit the API on
 *     every render of the discover screen.
 *   - Fails silently: if the API or the cache table is unreachable, the
 *     caller gets back null/undefined and can fall back to heuristics.
 */

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { createClient as createSupabaseJS } from "@supabase/supabase-js";

// ---------- config ----------

const MODEL = "claude-haiku-4-5-20251001";

// Keep responses tight — these strings render in tiny UI.
const MAX_TOKENS_REASON = 80;
const MAX_TOKENS_INTRO = 220;

// ---------- client singletons ----------

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

/**
 * Service-role Supabase client used ONLY inside this module to read/write the
 * ai_cache table (which has RLS locking out anon + authenticated roles).
 * Never expose this client outside src/lib/ai.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _serviceClient: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getServiceClient(): any | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!_serviceClient) {
    _serviceClient = createSupabaseJS(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _serviceClient;
}

// ---------- cache ----------

async function cacheGet<T>(key: string): Promise<T | null> {
  const sb = getServiceClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("ai_cache")
      .select("payload, expires_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (!data) return null;
    if (new Date(data.expires_at).getTime() < Date.now()) return null;
    return data.payload as T;
  } catch {
    return null;
  }
}

async function cacheSet<T>(key: string, ttlMin: number, payload: T) {
  const sb = getServiceClient();
  if (!sb) return;
  const expires = new Date(Date.now() + ttlMin * 60_000).toISOString();
  try {
    await sb
      .from("ai_cache")
      .upsert(
        { cache_key: key, payload, expires_at: expires },
        { onConflict: "cache_key" },
      );
  } catch {
    // swallow — cache failures must never block the response
  }
}

/**
 * Wrap an async producer with a Supabase-backed TTL cache. If the cache is
 * unreachable (no service role key, table missing, etc), just calls the
 * producer directly.
 */
export async function withCache<T>(
  key: string,
  ttlMin: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = await cacheGet<T>(key);
  if (hit !== null && hit !== undefined) return hit;
  const fresh = await fn();
  // Only cache truthy results — we want to retry if the API returned null.
  if (fresh !== null && fresh !== undefined) {
    void cacheSet(key, ttlMin, fresh);
  }
  return fresh;
}

/** Passive cleanup — call from a cron / edge function if you want. */
export async function pruneCache(): Promise<number> {
  const sb = getServiceClient();
  if (!sb) return 0;
  try {
    const { data } = await sb.rpc("prune_ai_cache");
    return typeof data === "number" ? data : 0;
  } catch {
    return 0;
  }
}

// ---------- shared types ----------

/**
 * Compact, LLM-friendly representation of a user. We pass two of these
 * (me + them) to the model and ask it to synthesize why they'd click.
 */
export type UserContext = {
  username: string;
  full_name?: string | null;
  bio?: string | null;
  industries?: string[];
  skills?: string[];
  tools?: string[];
  intent?: string | null;       // "hiring" | "looking_for_clients" | ...
  looking_for?: string[];       // free-form: "react dev", "design co-founder"
};

export type MatchBreakdown = {
  score: number;
  skill: number;
  industry: number;
  intent: number;
  behavior: number;
  network: number;
};

// ---------- prompt helpers ----------

function describeUser(u: UserContext, label: "Person A" | "Person B"): string {
  const parts: string[] = [];
  parts.push(`${label} (@${u.username})`);
  if (u.full_name) parts.push(`Name: ${u.full_name}`);
  if (u.bio) parts.push(`Bio: ${u.bio.slice(0, 200)}`);
  if (u.intent) parts.push(`Intent: ${u.intent.replace(/_/g, " ")}`);
  if (u.industries?.length) parts.push(`Industries: ${u.industries.slice(0, 4).join(", ")}`);
  if (u.skills?.length) parts.push(`Skills: ${u.skills.slice(0, 8).join(", ")}`);
  if (u.tools?.length) parts.push(`Tools: ${u.tools.slice(0, 8).join(", ")}`);
  if (u.looking_for?.length)
    parts.push(`Looking for: ${u.looking_for.slice(0, 5).join(", ")}`);
  return parts.join("\n");
}

function truncate(text: string, maxChars = 180): string {
  const one = text.trim().replace(/\s+/g, " ");
  if (one.length <= maxChars) return one;
  return one.slice(0, maxChars - 1).trimEnd() + "…";
}

// ---------- 1) natural-language match reason ----------

/**
 * Generate a single short sentence (<= ~20 words) that explains why Person A
 * should care about Person B. Used on match cards and profile badges to
 * replace the heuristic "Same industry: EdTech" style strings.
 *
 * Returns null if the API isn't configured or the call fails — callers must
 * fall back to their heuristic reasons.
 */
export async function generateMatchReason(
  me: UserContext,
  them: UserContext,
  breakdown: MatchBreakdown,
): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;

  const key = `reason:v1:${me.username}->${them.username}:${breakdown.score}`;

  return withCache<string | null>(key, 10, async () => {
    try {
      const prompt =
        `You are writing the single most compelling reason Person A should connect with Person B on a professional creator network.\n\n` +
        `${describeUser(me, "Person A")}\n\n${describeUser(them, "Person B")}\n\n` +
        `Signals (0–100): overall=${breakdown.score}, skill=${breakdown.skill}, industry=${breakdown.industry}, intent=${breakdown.intent}, behavior=${breakdown.behavior}, network=${breakdown.network}.\n\n` +
        `Write ONE sentence, max 20 words, in a warm second-person voice addressing Person A ("You…"). Be concrete — mention a specific skill, industry, or goal when possible. No greetings, no emoji, no quotes.`;

      const res = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS_REASON,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      });

      const blocks = res.content as Array<{ type: string; text?: string }>;
      const block = blocks.find((c) => c.type === "text");
      const text = block?.text ?? "";
      if (!text) return null;
      return truncate(text, 160);
    } catch (err) {
      console.warn("[ai.generateMatchReason] failed:", err);
      return null;
    }
  });
}

// ---------- 2) AI intro-message draft ----------

/**
 * Draft a short intro message Person A can send with their Connect request
 * to Person B. The user can edit it before sending. 2–3 sentences max.
 */
export async function generateIntroMessage(
  me: UserContext,
  them: UserContext,
  reason: string | null,
): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;

  const key = `intro:v1:${me.username}->${them.username}`;

  return withCache<string | null>(key, 15, async () => {
    try {
      const prompt =
        `You are drafting a friendly, first-contact message from Person A to Person B on a professional creator network. Person A will review and edit before sending.\n\n` +
        `${describeUser(me, "Person A")}\n\n${describeUser(them, "Person B")}\n\n` +
        (reason ? `Why they match: ${reason}\n\n` : ``) +
        `Write a message from Person A's perspective. Rules:\n` +
        `- 2 to 3 sentences, under 60 words.\n` +
        `- Start with "Hey ${them.full_name?.split(" ")[0] || them.username}" or "Hi @${them.username}".\n` +
        `- Reference ONE specific thing about Person B (a skill, a project, their industry).\n` +
        `- End with a soft ask ("would love to chat", "open to a quick call?", "keen to swap notes").\n` +
        `- No emoji, no hashtags, no quotes, no sign-off like "Best,".\n` +
        `Output ONLY the message body.`;

      const res = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS_INTRO,
        temperature: 0.6,
        messages: [{ role: "user", content: prompt }],
      });

      const blocks = res.content as Array<{ type: string; text?: string }>;
      const block = blocks.find((c) => c.type === "text");
      const text = block?.text ?? "";
      if (!text) return null;
      return text.trim();
    } catch (err) {
      console.warn("[ai.generateIntroMessage] failed:", err);
      return null;
    }
  });
}


// ---------- cache-invalidation helpers ----------

/**
 * Called from write-actions that change a user's matching-relevant fields
 * (prefs, new PoW post, new connection). We do a cheap prefix-delete of any
 * cached AI results involving this user.
 */
export async function invalidateUserAiCache(username: string) {
  const sb = getServiceClient();
  if (!sb) return;
  try {
    const u = username.replace(/[,%]/g, ""); // PostgREST-safe
    const filter =
      "cache_key.like.%:" + u + "->%," +
      "cache_key.like.%->" + u + ":%," +
      "cache_key.like.%->" + u;
    await sb.from("ai_cache").delete().or(filter);
  } catch {
    // best-effort
  }
}
