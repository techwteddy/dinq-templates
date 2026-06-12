# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

_No unreleased changes._

---

## [1.5.0] — 2026-06-04

### Added
- Framer Motion scroll-triggered animations (`AnimatedSection` component) on all sections with `prefers-reduced-motion` support
- Mouse spotlight radial gradient effect that follows the cursor on desktop (`MouseSpotlight` component)
- Skip-to-content link (`<a href="#hero">`) for keyboard navigation accessibility
- `Escape` key handler to close mobile navbar menu and all modals (ProjectsGrid, Timeline)
- `:focus-visible` teal ring replacing default browser outline across all interactive elements
- `@media (prefers-reduced-motion: reduce)` CSS reset in `globals.css`

### Changed
- Section vertical padding standardized to `py-20` across SkillsSlider, ProjectsGrid, Contact
- Contact section fully refactored: flex two-column layout on desktop, cards extracted to typed array, `flex-col` + `flex-1` for uniform card heights, all card content centered

### Fixed
- Contact section desktop layout: text column left-aligned, cards column right, properly vertically centered

---

## [1.4.0] — 2026-06-04

### Added
- 4 recent projects added to top of ProjectsGrid (most recent first):
  - DevInterviewLab (Next.js, TypeScript, Supabase, Groq AI, PWA, Radix UI)
  - Interview Command Center (React, Vite, Supabase, Claude AI, PWA)
  - Ghiberti UI (React, Next.js, Storybook, Turborepo, Radix UI)
  - Finanças do Casal (React, Vite, Supabase, Claude AI, PWA)

### Changed
- Hero headline updated: `Frontend Expert` → `Senior Fullstack Expert`
- README Highlighted Projects table updated with new projects

### Fixed
- Project card images fixed to uniform `h-48` height with `object-cover object-top` (crops from bottom)
- Project modal: `max-h-[90vh] overflow-y-auto` prevents close button from going off-screen on tall images
- Project modal image: consistent `h-48` container with `fill + object-top`
- Forced Vercel image cache refresh (new deploy) for updated GitHub profile photo

---

## [1.3.0] — 2026-05-30

### Added
- HTTP security headers configured globally in `next.config.ts`: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`
- Jest 30 + React Testing Library test infrastructure (28 tests, 6 suites)
- GitHub Actions CI pipeline: lint → test:coverage → build on every PR and push to `main`
- `CLAUDE.md` — mandatory workflow rules for AI agents
- `docs/ARCHITECTURE.md` — architecture overview, stack decisions, styling conventions
- `docs/COMPONENTS.md` — per-component reference with data shapes and constraints
- `docs/adr/001–004` — Architecture Decision Records (Next.js App Router, no API routes, Tailwind + glassmorphism, testing strategy)
- `.claude/commands/` — slash commands: `/new-component`, `/add-project`, `/security-check`
- `CHANGELOG.md` (this file)
- npm scripts: `test`, `test:watch`, `test:coverage`

### Changed
- `next.config.ts` migrated to typed `NextConfig` export
- Removed deprecated `swcMinify` and `experimental.modern` options
- SVG sandbox CSP tightened to `script-src 'none'`

### Fixed
- Next.js upgraded `15.1.6` → `15.1.11` to resolve React Server Components CVE

---

## [1.2.0] — 2026-05-18

### Added
- `README.md` fully rewritten in English for recruiters: tech stack, features, project structure, highlighted projects, professional background, education, getting started, contact, security section

---

## [1.1.0] — 2025-07-04

### Changed
- CV PDF updated (`public/fernando-ghiberti-cv-en.pdf`)

### Fixed
- Timeline card position on extra-large screens

---

## [1.0.0] — 2025-01-30

### Added
- Initial portfolio release
- `Navbar` — fixed top navigation with smooth scroll and mobile hamburger menu
- `Hero` — profile photo, name, typewriter animation, social links, CV download
- `SkillsSlider` — dual auto-scrolling skill carousels with proficiency bars (19 skills)
- `ProjectsGrid` — filterable, paginated project grid with modal detail view (12 projects)
- `Timeline` — alternating vertical timeline with professional and education entries
- `Contact` — Email, WhatsApp, LinkedIn, GitHub contact cards
- `Footer` — back-to-top button and author credit
- Glassmorphism visual design system
- Responsive mobile-first layout
- `next/image` optimization with WebP and lazy loading
- Geist font via `next/font`
- Vercel deployment with automatic preview URLs per PR
