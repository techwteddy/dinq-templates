# GHAR Foundation - Project Documentation

> Last Updated: March 2026

## Overview
Official website for GHAR Foundation, a German-registered humanitarian 
organization providing aid to crisis-affected regions in Sudan and Yemen.

## 🔗 Development Conversations (Claude AI)
- Sprint 1 - Setup & Foundation
- Sprint 2 - Core Pages (Navbar, Footer, Home, About, Projects)
- Sprint 3 - Features (News, Donate, Volunteer, Transparency)
- Sprint 4 - i18n, SEO, GDPR
- Sprint 5 - Sanity CMS Integration & Launch Prep

## Tech Stack
- **Frontend:** Next.js 16 (App Router)
- **CMS:** Sanity.io (Embedded Studio at /studio) ✅ Connected
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend (pending ghar.de domain)
- **Payments:** PayPal (pending Business account)
- **i18n:** next-intl (EN / AR RTL / DE)
- **Hosting:** Vercel (Auto Deploy from main branch)
- **Repo:** https://github.com/ibra8080/GHAR

## 🎨 Brand Colors
- Primary: #1A6FA0
- Secondary: #2D8F16
- Accent: #EF8800
- Dark: #2A2A2A
- Background: #FCFCFA

## Sanity Config
- Project ID: eg9gx04a
- Dataset: ghar
- Studio URL: /studio (also at ghar-seven.vercel.app/studio)
- Schemas: project, news, teamMember, partner, heroSlide, stat, siteSettings, aboutContent

## Supabase Config
- Project URL: https://kpojqhpyllzaxcpgmhmo.supabase.co
- Region: Europe (Frankfurt)

## Vercel Config
- Live URL: https://ghar-seven.vercel.app
- Production Branch: main
- Auto Deploy: enabled
- Webhook: Sanity → Vercel (auto redeploy on content change)

## Environment Variables
```
NEXT_PUBLIC_SANITY_PROJECT_ID=eg9gx04a
NEXT_PUBLIC_SANITY_DATASET=ghar
NEXT_PUBLIC_SUPABASE_URL=https://kpojqhpyllzaxcpgmhmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fNx7V_VTzPS-5crWWnvzig_Wu6qNXbA
RESEND_API_KEY=re_QPS2X7pC_P496DX3ekVmhfcTxxVfioj3x
SANITY_API_TOKEN=*** (in Vercel env vars)
```

## Database Tables
- **contact_messages** → id, name, email, message, created_at
- **donors** → id, name, email, amount, donation_type, project, paypal_tx_id, status, created_at
- **volunteers** → id, name, phone, email, country, specialty, availability, message, created_at

## 📄 Pages
| Page | Route | Status | Sanity |
|------|-------|--------|--------|
| Home | / | ✅ Live | ✅ Connected |
| About | /about | ✅ Live | ✅ Connected |
| Projects | /projects | ✅ Live | ✅ Connected |
| Project Detail | /projects/[id] | ✅ Live | ✅ Connected |
| News | /news | ✅ Live | ✅ Connected |
| Donate | /donate | ✅ Live | ✅ Connected |
| Volunteer | /volunteer | ✅ Live | ⬜ Static form |
| Transparency | /transparency | ✅ Live | ⬜ Static content |
| Privacy Policy | /privacy | ✅ Live | ⬜ Static content |

## 📁 Key Files
```
sanity/schemaTypes/          → Sanity schemas (8 schemas)
sanity/lib/queries.ts        → GROQ queries for all data
sanity/lib/client.ts         → Sanity client config
app/globals.css              → Brand colors (@theme inline syntax)
components/layout/Navbar.tsx → Main navigation (i18n + language switcher)
components/layout/Footer.tsx → Main footer (connected to Sanity siteSettings)
components/layout/CookieBanner.tsx → GDPR cookie consent
app/api/send-volunteer-confirmation/route.ts → Resend email API
i18n/routing.ts              → next-intl routing config
i18n/request.ts              → next-intl request config
messages/en.json             → English translations
messages/ar.json             → Arabic translations
messages/de.json             → German translations
lib/utils.ts                 → getCountryName() utility
scripts/importToSanity.ts    → Import projects to Sanity
scripts/importNews.ts        → Import news to Sanity
scripts/importAll.ts         → Import all data to Sanity
proxy.ts                     → next-intl middleware (Next.js 16 naming)
```

## GitHub Workflow
- main → Production
- develop → Integration
- feature/xxx → Per feature

## Agile Progress

### Sprint 1 ✅ DONE
- Next.js + Tailwind setup
- GitHub + Kanban Board
- Vercel Auto Deploy
- Sanity CMS + Embedded Studio
- Supabase integration
- next-intl (EN/AR/DE)

### Sprint 2 ✅ DONE
- Navbar + Footer
- Home Page (Hero slider, Projects, Stats, News)
- About Page (Story, Mission, Values, Team, Contact Form)
- Projects Page + Project Detail Page

### Sprint 3 ✅ DONE
- News Page (Pagination + Year filter)
- Donate Page (PayPal + Supabase)
- Volunteer Page (Form + Supabase + Resend email)
- Transparency Page

### Sprint 4 ✅ DONE
- i18n — Arabic (RTL) + German + English (next-intl)
- SEO — Metadata for all pages (EN/AR/DE)
- GDPR — Cookie consent + Privacy Policy
- PayPal Business — Deferred
- Resend Domain — Deferred (ghar.de)

### Sprint 5 ✅ DONE
- Sanity schemas (8 schemas: project, news, teamMember, partner, heroSlide, stat, siteSettings, aboutContent)
- All data imported to Sanity
- All pages connected to Sanity CMS
- lib/data.ts removed — fully migrated
- Sanity Studio registered on Vercel
- Webhook: Sanity → Vercel auto-redeploy
- Footer connected to Site Settings
- Donate page connected to Site Settings
- Code quality: TypeScript ✅ ESLint ✅ Build ✅

### 🚀 Remaining Before Launch
- [ ] Functional testing (forms, navigation, languages)
- [ ] PayPal Business account connection
- [ ] Resend domain (ghar.de)
- [ ] Custom domain (ghar.de) on Vercel

## Key Decisions
- PayPal Giving Fund first (faster approval than Stripe)
- Stripe to be added after approval
- Launchgood as additional donation channel
- DZI certification target after 2 years of operation
- Sanity free plan sufficient for current needs
- Resend free plan: sends only to registered email until ghar.de domain connected

## ⚠️ Important Technical Notes
- `globals.css` uses `@theme inline` syntax — do NOT use standard Tailwind config
- Straight quotes `"` cause TypeScript errors in JSX — use `&ldquo;` / `&rdquo;`
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for routing
- Sanity singleton docs (siteSettings, aboutContent) use `_id` for createOrReplace
- `suppressHydrationWarning` needed on `app/layout.tsx` html+body tags
- Server Components fetch from Sanity, Client Components receive data as props
- All pages follow Server Component (data fetching) + Client Component (interactivity) pattern
- `lib/utils.ts` contains `getCountryName()` using ISO codes (SD, YE, PS)
