# CLAUDE.md — AI Agent Instructions for next-portfolio

This file governs how AI agents (Claude Code and others) must work on this repository.
All rules below are mandatory. Follow them on every task without exception.

---

## Project Overview

Personal portfolio SPA built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.
Single page composed of: Navbar → Hero → SkillsSlider → ProjectsGrid → Timeline → Contact → Footer.
AI chat powered by **Groq (LLaMA 3.3-70b)** via `/api/chat`.
Deployed automatically to Vercel on every push to `main`.

---

## Workflow — Mandatory for Every Change

### 1. Branch
Always work on a dedicated branch. Never commit directly to `main`.

```bash
git checkout -b <type>/<short-description>
# e.g. feat/add-dark-mode, fix/modal-close-button, docs/update-readme
```

Branch naming convention: `feat/`, `fix/`, `docs/`, `refactor/`, `security/`, `test/`.

### 2. Code
- Keep changes minimal and focused — no unrelated refactors.
- Do not add abstractions beyond what the task requires.
- Follow the existing code patterns in each file.
- No comments unless the WHY is non-obvious.
- No `console.log` in committed code (enforced by `removeConsole` in production).

### 3. Tests — Required for every functional change
Run the full test suite before committing:

```bash
npm test
```

**Rules:**
- Every new component or feature must ship with tests in `src/__tests__/<ComponentName>.test.tsx`.
- API route changes must be covered in `src/__tests__/api-chat.test.ts`.
- Every bug fix must include a regression test.
- When a component is removed, delete its test file too.
- Coverage threshold is **70% lines** (enforced by Jest). Do not lower it.
- Tests must pass locally before pushing.
- API route tests use `@jest-environment node` at the top of the file (browser APIs guarded by `typeof window !== "undefined"` in `jest.setup.ts`).

Test commands:
```bash
npm test                  # run all tests once
npm run test:watch        # watch mode during development
npm run test:coverage     # run with coverage report
```

### 4. Lint & Build
Run lint and build before opening a PR:

```bash
npm run lint
npm run build
```

Both must pass with zero errors.

### 5. Commit
Write clear, conventional commit messages:

```
<type>(<scope>): <short summary>

- bullet detail if needed
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `security`, `chore`.

### 6. Pull Request
Always open a PR to merge into `main`. Never push directly.

PR checklist:
- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build passes (`npm run build`)
- [ ] Tests added for new/changed functionality
- [ ] Documentation updated if the feature surface changed
- [ ] Security implications reviewed (see Security section)

Merge method: **squash**.

### 7. Documentation
Keep the following in sync after every change:

| File | Update when |
|---|---|
| `README.md` | Tech stack, features, project structure, commands, or env vars change |
| `CLAUDE.md` | Workflow, tooling, or project architecture changes |
| `src/__tests__/` | Any component or API route is added, changed, or removed |

If you add a feature → add it to the README features section.
If you remove a feature → remove it from README, delete its tests, remove dead code.

### 8. Deploy
The Vercel deployment is triggered automatically when a PR is merged to `main`.
No manual deploy step is needed — merging IS deploying.
The CI pipeline (`ci.yml`) must be green before merging.

---

## Security Checklist

Review the following on every PR:

- [ ] No secrets, tokens, API keys, or credentials committed — use environment variables.
- [ ] No new `dangerouslyAllowSVG` usages without a tight `contentSecurityPolicy`.
- [ ] External URLs hardcoded in components must be trusted, static origins.
- [ ] New `remotePatterns` in `next.config.ts` must be limited to the exact hostname needed.
- [ ] HTTP security headers in `next.config.ts` must not be weakened. `unsafe-eval` must NOT be added to production CSP.
- [ ] No `eval()`, `dangerouslySetInnerHTML`, or unescaped user input.
- [ ] Dependencies added via `npm install` must be audited with `npm audit`.
- [ ] Any new API route must implement: rate limiting, input validation (type + length), and explicit CORS headers.
- [ ] User-supplied values must never be interpolated raw into LLM prompts — validate against an allowlist first.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — metadata, fonts, providers, global overlays
│   ├── page.tsx                # Page composition (TerminalIntro + all section components)
│   ├── globals.css             # Global styles, CSS custom properties, color tokens
│   └── api/
│       └── chat/
│           └── route.ts        # Groq AI chat endpoint (rate-limited, input-validated, CORS)
├── components/
│   ├── Navbar.tsx              # Fixed top nav, smooth scroll, language & theme toggles
│   ├── Hero.tsx                # Profile, typewriter, social links, CV download
│   ├── StatsCounter.tsx        # Animated statistics counters
│   ├── SkillsSlider.tsx        # Dual auto-scroll carousels with SkillsRadar
│   ├── SkillsRadar.tsx         # Recharts radar chart for expertise areas
│   ├── ProjectsGrid.tsx        # Filterable grid with modals (tag filter + pagination)
│   ├── Timeline.tsx            # Career & education timeline (horizontal/vertical) with modals
│   ├── Contact.tsx             # Email, WhatsApp, LinkedIn, GitHub contact cards
│   ├── Footer.tsx              # Back-to-top button + author credit
│   ├── AskFernando.tsx         # Floating AI chat widget (Groq-powered)
│   ├── TerminalIntro.tsx       # One-time terminal boot animation
│   ├── AnimatedSection.tsx     # Scroll-triggered Framer Motion entrance animations
│   ├── CustomCursor.tsx        # Custom animated cursor (pointer devices only)
│   ├── MouseSpotlight.tsx      # Mouse-following radial spotlight overlay
│   └── SkipLink.tsx            # Accessibility skip-to-content link
├── context/
│   ├── LanguageContext.tsx     # EN / PT-BR language state (React Context)
│   └── ThemeContext.tsx        # Dark / light theme state (React Context)
└── lib/
    └── translations.ts         # All UI strings for EN and PT-BR

src/__tests__/                  # One test file per component + api-chat.test.ts
__mocks__/                      # Static file stubs for Jest
.github/workflows/ci.yml        # CI: lint → test → build on every PR and push to main
public/
└── fernando-ghiberti-cv-en.pdf
```

---

## Color System

CSS custom properties defined in `globals.css` drive all accent colors. Always use these variables — never hardcode `#14b8a6` or `#3b82f6` directly in components.

| Token | Dark mode | Light mode | WCAG contrast on bg |
|---|---|---|---|
| `--accent-teal` | `#14b8a6` (teal-400) | `#0f766e` (teal-700) | 4.6:1 ✅ |
| `--accent-blue` | `#3b82f6` (blue-500) | `#1d4ed8` (blue-700) | 5.7:1 ✅ |
| `--gradient-accent` | `linear-gradient(135deg, teal, blue)` | same direction, darker stops | — |
| `--gradient-accent-r` | same, `to right` direction | same | — |

Light mode Tailwind class overrides (`.text-teal-400`, `.bg-teal-400`, `.from-teal-400`, etc.) are declared in `globals.css` — do not add per-component overrides.

---

## Testing Conventions

- Use `@testing-library/react` — test behavior, not implementation.
- Do not test internal state or implementation details.
- Prefer `getByRole`, `getByText`, `getByLabelText` over `getByTestId`.
- Use `data-testid` only as a last resort when no semantic query works.
- Mock external dependencies (e.g. `typewriter-effect`, `next/image`, `next/font`) at the top of the test file.
- Each describe block maps to one component. Group tests by feature within the block.
- API route tests must be in a `.test.ts` (not `.tsx`) file with `@jest-environment node` at the top.

Minimum test coverage per component:
- Renders without crashing
- Renders key content (headings, labels, links)
- Interactive behavior (clicks, toggles, modals)
- Edge cases relevant to the component's logic

Minimum test coverage per API route:
- Happy path returns expected response
- Input validation returns 400 for each invalid field
- Rate limiting returns 429
- Missing env var returns 503

---

## Tech Stack Reference

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Icons | Font Awesome React | 6.x |
| Carousel | React Slick | 0.30.x |
| Animation | Typewriter Effect | 2.x |
| Motion | Framer Motion | 11.x |
| Charts | Recharts | 2.x |
| AI | Groq SDK (LLaMA 3.3-70b) | — |
| Testing | Jest + React Testing Library | 30.x / 16.x |
| CI/CD | GitHub Actions + Vercel | — |

---

## Commands Reference

```bash
npm run dev            # start dev server at localhost:3000
npm run build          # production build (must pass before PR)
npm run lint           # ESLint check (must pass before PR)
npm test               # run all tests (must pass before PR)
npm run test:coverage  # tests + coverage report
```
