import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// ── Rate limiting ─────────────────────────────────────────────────
// In-memory sliding window — resets per serverless instance.
// Acceptable for a low-traffic portfolio; upgrade to Upstash Redis
// if traffic scales to multiple concurrent instances.
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;        // max requests per IP
const RATE_WINDOW = 60_000;   // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Input constants ───────────────────────────────────────────────
const ALLOWED_ROLES = new Set(["user", "assistant"]);
const MAX_MSG_LENGTH = 2000;
const MAX_MESSAGES = 10;
const ALLOWED_LANGS = new Set(["en", "pt"]);

// ── System prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Fernando Ghiberti's AI assistant on his portfolio website. Answer questions about Fernando concisely and professionally, always in the same language the user writes in (Portuguese or English).

## About Fernando Ghiberti
- **Role**: Senior Fullstack Developer with 10+ years of experience
- **Location**: Brazil
- **Email**: ghiberti85@gmail.com
- **LinkedIn**: linkedin.com/in/fernandoghiberti
- **GitHub**: github.com/ghiberti85

## Skills
Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Storybook
Backend: Node.js, Supabase, PostgreSQL, REST APIs
AI Integration: Groq API, Claude API, OpenAI
Tools: Git, GitHub Actions, Vercel, Jest, React Testing Library, Turborepo, Radix UI, PWA

## Recent Projects
1. **DevInterviewLab** — AI-powered interview prep platform (Next.js, TypeScript, Supabase, Groq AI, PWA, Radix UI)
2. **Interview Command Center** — Real-time interview assistant (React, Vite, Supabase, Claude AI, PWA)
3. **Ghiberti UI** — Component library with Storybook (React, Next.js, Storybook, Turborepo, Radix UI)
4. **Finanças do Casal** — Couples finance manager (React, Vite, Supabase, Claude AI, PWA)

## Professional Background
Fernando is a Senior Fullstack Developer passionate about building high-quality web products with modern technologies. He specializes in React/Next.js frontends with Supabase backends, and has deep experience integrating AI APIs into production applications. He is available for new opportunities.

Answer factual questions about Fernando. If asked something you don't know about him, say you don't have that information and suggest contacting him directly.`;

// ── CORS helper ───────────────────────────────────────────────────
function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const allowed = [siteUrl, vercelUrl].filter(Boolean) as string[];

  // If no expected origin is configured (local dev) or origin matches, allow it
  const allowOrigin =
    !origin || allowed.length === 0 || allowed.includes(origin) ? (origin ?? "*") : null;

  return allowOrigin
    ? { "Access-Control-Allow-Origin": allowOrigin, "Access-Control-Allow-Methods": "POST, OPTIONS" }
    : null;
}

// ── Preflight ─────────────────────────────────────────────────────
export async function OPTIONS(req: NextRequest) {
  const headers = corsHeaders(req);
  if (!headers) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers });
}

// ── POST /api/chat ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // CORS check
  const cors = corsHeaders(req);
  if (!cors) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { messages, lang } = body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Validate each message: role and content
    for (const msg of messages) {
      if (!ALLOWED_ROLES.has(msg.role)) {
        return NextResponse.json({ error: "Invalid message role" }, { status: 400 });
      }
      if (typeof msg.content !== "string" || msg.content.length > MAX_MSG_LENGTH) {
        return NextResponse.json({ error: "Invalid message content" }, { status: 400 });
      }
    }

    // Validate lang — default to "en" if invalid/missing
    const safeLang = ALLOWED_LANGS.has(lang) ? lang : "en";

    const langInstruction =
      safeLang === "pt"
        ? "\n\nIMPORTANT: The user has the site in Portuguese. Always respond in Brazilian Portuguese."
        : "\n\nIMPORTANT: The user has the site in English. Always respond in English.";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langInstruction },
        ...messages.slice(-MAX_MESSAGES),
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response.";
    return NextResponse.json({ reply }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
