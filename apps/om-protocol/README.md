<div align="center">

  <img src="docs/assets/hero.gif" alt="The OM Protocol — cosmic breathing animation" width="600" />

  <br />
  <br />

  # The OM Protocol

  A guided meditation web app with AI-powered journaling,
  real-time audio synthesis, and offline-first PWA architecture.

  [Live Demo](https://theomprotocol.com) · [Architecture](docs/architecture.md) · [ADRs](docs/adr/)

  ![Build](https://img.shields.io/github/actions/workflow/status/gleicipereira/theomprotocol/ci.yml?branch=main&style=flat-square)
  ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript&logoColor=white)
  ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
  ![Netlify](https://img.shields.io/badge/deployed%20on-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)

</div>

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4 with custom brand design tokens
- **Auth & DB:** Supabase (Postgres, Auth, Realtime)
- **CMS:** Sanity (structured content for guided meditations)
- **Payments:** Stripe (subscriptions)
- **AI:** Claude API (journal analysis)
- **Audio:** Tone.js (real-time audio synthesis)
- **Animations:** Framer Motion + HTML Canvas
- **PWA:** Serwist (offline-first, installable)
- **Hosting:** Netlify

## Getting Started

```bash
# Clone and install
git clone https://github.com/gleicipereira/theomprotocol.git
cd theomprotocol
npm install

# Configure environment
cp .env.example .env.local
# Fill in your keys — see .env.example for details

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.tsx    # Root layout (fonts, metadata, viewport)
│   ├── page.tsx      # Landing page (server component)
│   └── globals.css   # Tailwind + brand design tokens + animations
├── components/       # Reusable client components
│   ├── cosmic-canvas.tsx   # Animated starfield/orb background
│   ├── breathing-orb.tsx   # 4-2-6 breathing circle
│   └── landing-content.tsx # Landing page interactive content
public/
├── manifest.json     # PWA manifest
└── icons/            # PWA icons (placeholder)
```

## License

MIT
