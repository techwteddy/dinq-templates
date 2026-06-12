# Architecture

## Overview

This is a **static single-page portfolio** with no backend, no database, and no authentication.
All data is hardcoded in the component files. The app is deployed as a static export via Vercel.

```
Browser → Vercel CDN → Next.js static HTML/JS → React components
```

---

## Stack Decisions (why, not just what)

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSR/SSG out of the box, image optimization, font loading, file-based routing — all without config |
| Language | TypeScript | Catches shape errors in component data (skills array, projects array, timeline items) at compile time |
| Styling | Tailwind CSS | Utility-first keeps styles co-located with markup; no context switching; easy to enforce the glassmorphism pattern |
| Icons | Font Awesome React | SVG-based, tree-shakeable, already covers all needed icons (brands + solid sets) |
| Carousel | React Slick | Handles RTL direction (used for the reverse-scroll second slider) out of the box |
| Animation | Typewriter Effect | Minimal, zero-dependency typewriter — no need for a full animation library for one use case |
| Testing | Jest + RTL | Industry standard for React; RTL enforces behavior-first testing |
| Deployment | Vercel | Zero-config Next.js deploys; preview URLs per PR; automatic production deploy on `main` merge |

---

## What this project intentionally does NOT have

| Missing | Reason |
|---|---|
| API routes (`/api/*`) | No dynamic data — everything is static. Adding API routes would require a runtime and increase cost/complexity for zero benefit. |
| State management (Redux, Zustand, etc.) | No shared state between components. Each component manages its own local UI state (modal open/closed, visible count). |
| Database | No persistence needed. Data lives in the component files. |
| Authentication | Public portfolio — no protected routes. |
| CMS integration | Data volume is small and changes infrequently. A CMS would add external dependencies and complexity. |
| `pages/` directory | App Router is the current Next.js standard. Pages Router is legacy. |
| CSS Modules / styled-components | Tailwind handles all styling. Mixed systems create inconsistency. |

---

## Component Composition

The single page (`src/app/page.tsx`) imports and sequences all section components:

```
page.tsx
├── <Navbar />        fixed top, z-50, smooth scroll
├── <Hero />          min-h-screen, flex row on lg
├── <SkillsSlider />  two sliders, opposite autoplay direction
├── <ProjectsGrid />  6-up paginated grid, tag filter, modal
├── <Timeline />      alternating left/right layout, modal
├── <Contact />       2-col grid of contact cards
└── <Footer />        back-to-top button + author line
```

Components are **independent and stateless relative to each other** — they do not share state, do not call each other, and do not use Context. Each section handles its own UI state internally (e.g. modal visibility, active filter tag, visible project count).

---

## Data Layer

There is no data fetching. All data is defined as TypeScript arrays/objects inside the component files:

| Data | Location | Shape |
|---|---|---|
| Skills list | `SkillsSlider.tsx` → `skills: Skill[]` | `{ name, icon (URL), level (0–100) }` |
| Projects list | `ProjectsGrid.tsx` → `projects: Project[]` | `{ title, image, description, github, live, tags[] }` |
| Timeline items | `Timeline.tsx` → `timelineData: TimelineItem[]` | `{ title, period, type, institution, location, details[] }` |

To add/edit content: update the array in the relevant component file. No API calls, no migrations.

---

## Styling Conventions

### Glassmorphism Card Pattern
All content cards (skills, projects, timeline items, contact cards) use this exact pattern:

```tsx
style={{
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}}
```

Do not deviate from these values without updating all cards consistently.

### Color Palette
The project uses two accent gradients exclusively:

| Usage | Gradient |
|---|---|
| Headings, progress bars, buttons | `from-teal-400 to-blue-500` |
| Profile ring, type badges | `from-purple (#9333ea) to-blue (#3b82f6)` |
| Hover accents | `teal-400` or `blue-500` individually |

Background: dark (`bg-gray-900` / near-black). Text: `text-gray-300` (primary), `text-gray-400` (secondary).

### Responsive Breakpoints
The project uses Tailwind's default breakpoints. Key patterns:
- `lg:` = desktop layout switch (single-column → multi-column, hidden nav → visible nav)
- `sm:` = minor grid adjustments (1-col → 2-col in contact section)
- Mobile-first: default styles target mobile, `lg:` overrides for desktop

---

## Security Architecture

HTTP security headers are configured globally in `next.config.ts` via the `headers()` async function.
They apply to all routes (`source: "/(.*)"`) and include:

- **CSP** — restricts script, style, font, and image sources to trusted origins only
- **X-Frame-Options: SAMEORIGIN** — prevents clickjacking
- **X-Content-Type-Options: nosniff** — prevents MIME sniffing
- **HSTS** — forces HTTPS for 2 years with preload
- **Referrer-Policy** — limits referrer data sent to external origins
- **Permissions-Policy** — disables camera, microphone, geolocation

SVG images (skill icons from CDN) require `dangerouslyAllowSVG: true` in the `images` config.
This is mitigated by a strict sandbox CSP on the image handler: `script-src 'none'`.

**Do not weaken any of these headers.** If a new feature requires relaxing a policy, document the reason in an ADR.

---

## CI/CD Pipeline

```
git push → GitHub Actions (ci.yml)
              ├── npm run lint
              ├── npm run test:coverage   (fails if < 70% line coverage)
              └── npm run build
                        ↓ (on merge to main)
                   Vercel auto-deploy → production
```

Preview deployments are created automatically by Vercel for every PR branch.
The production URL is only updated when `main` changes.
