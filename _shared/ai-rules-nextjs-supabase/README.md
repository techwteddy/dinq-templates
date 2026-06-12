# Next.js 15+ / Tailwind v4 / Supabase - AI Rules

> Make Cursor & Claude Code generate production-ready code for this stack. Every time.

Stop fixing the same AI mistakes: `"use client"` everywhere, `getSession()` instead of `getUser()`, synchronous params, `select('*')`, `tailwind.config.js` on Tailwind v4.

Drop these rules in your project and your AI follows your conventions automatically.

## What's included (free)

**For Cursor** - `.cursorrules` with the 20 most impactful rules:
- Server Components by default
- Async `params` / `searchParams` (Next.js 15+ breaking change)
- Correct Supabase client setup (browser vs server)
- `getUser()` for auth (not `getSession()` - security risk)
- Project structure conventions
- TypeScript strict mode (no `any`)

**For Claude Code** - `SKILL.md` with the same core rules, auto-triggered when working on Next.js + Supabase files.

## Quick start

**Cursor:**
```bash
# Clone and copy to your project root
curl -o .cursorrules https://raw.githubusercontent.com/Marinou92/ai-rules-nextjs-supabase/main/cursor/.cursorrules
```

**Claude Code:**
```bash
# Copy to your skills directory
git clone https://github.com/Marinou92/ai-rules-nextjs-supabase.git ~/.claude/skills/nextjs-supabase
```

Open your editor. Start coding. The AI reads the rules automatically.

## Before / After

**Without rules** - what your AI generates by default:

```tsx
'use client' // <- unnecessary, kills performance

export default function Page({ params }: { params: { slug: string } }) { // <- broken in Next.js 15
  const [data, setData] = useState(null)

  useEffect(() => { // <- should be server-side
    supabase.from('posts').select('*') // <- fetches all columns
      .then(({ data }) => setData(data))
  }, [])
```

**With rules** - same prompt, same AI:

```tsx
// Server Component - zero client JS
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }> // <- correct Next.js 15+ type
}) {
  const { slug } = await params
  const supabase = await createServerClient() // <- server client, not browser
  const { data: post, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at') // <- explicit columns
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(error.message) // <- error handled
  if (!post) notFound() // <- 404 handled
```

## Full pack - 400+ rules, 15 prompts, 3 reference files

The free version covers the fundamentals. The full pack covers the entire stack:

| | Free (this repo) | Full Pack |
|---|---|---|
| Core conventions | 20 rules | 400+ rules |
| Async params fix | ✓ | ✓ |
| Server vs Client Components | ✓ | ✓ |
| Supabase client setup | ✓ | ✓ |
| Server Actions + Zod validation | - | ✓ |
| `useActionState` forms (React 19) | - | ✓ |
| Tailwind v4 `@theme` + oklch | - | ✓ |
| Auth middleware pattern | - | ✓ |
| RLS policy patterns | - | ✓ |
| Realtime subscriptions | - | ✓ |
| Error boundaries + loading states | - | ✓ |
| Route Handlers | - | ✓ |
| 15 ready-to-paste prompts | - | ✓ |
| Claude Code skill with progressive disclosure | basic | 3 reference files |
| `.mdc` format (Cursor 2025+) | - | ✓ |
| Before/after examples | 1 example | full comparison doc |
| QA tested on 12 scenarios | - | ✓ |
| Updates when Next.js / Tailwind ship breaking changes | - | ✓ |

**-> [Get the full pack ($19)](https://marinedep.gumroad.com/l/hvgqmm)**

## Works with

| Tool | Format | Status |
|---|---|---|
| Cursor | `.cursorrules` + `.mdc` | ✓ Full support |
| Claude Code | `SKILL.md` | ✓ Full support |
| OpenAI Codex CLI | `AGENTS.md` | ✓ Same SKILL.md format |
| Windsurf | `.windsurfrules` | ✓ Same content, rename file |
| Continue.dev | `.continuerules` | ✓ Same content, rename file |
| GitHub Copilot | `copilot-instructions.md` | ✓ Same content |

Need to convert between formats? Use **[0toprod]([https://ruleshift.dev](https://0toprod.dev/convert))** - free, open source.

## Compatibility

| Dependency | Supported |
|---|---|
| Next.js | 15.x - 16.x |
| Tailwind CSS | v4.x |
| Supabase | @supabase/ssr 0.5+ |
| TypeScript | 5.3+ |
| React | 19+ |

## Other packs (coming soon)

- **Prototype -> Production Scanner** - Claude Code skill that audits vibe-coded repos and auto-fixes security, testing, and deployment gaps. -> [Follow on LinkedIn](https://www.linkedin.com/in/marine-depoorter-0165ab140/)
- **Agent Recipe Bundle** - 30 multi-step recipes for deploy, payments, auth & security. -> [Follow on LinkedIn](https://www.linkedin.com/in/marine-depoorter-0165ab140/)

## Contributing

Found a rule that Cursor/Claude ignores? Open an issue with:
1. The rule you added
2. The prompt you used
3. What the AI generated (wrong output)
4. What you expected

PRs welcome for the free version. The full pack is maintained separately.

## License

The free version in this repo is MIT licensed. Use it however you want.

The full pack is sold under a single-user commercial license via [Gumroad](https://marinedep.gumroad.com/l/hvgqmm).

---

**Built by [Marine Depoorter on X](https://x.com/Marine_Lucid)** - AI engineer shipping dev tools. Also on [LinkedIn](https://www.linkedin.com/in/marine-depoorter-0165ab140/).

If this saved you time, star the repo. It helps others find it.
