# GHAR Foundation — Project Summary for Next Session
> Last Updated: April 2026

---

## 🔧 Tech Stack
- **Frontend:** Next.js 16 (App Router)
- **CMS:** Sanity.io — Project ID: `eg9gx04a`, Dataset: `ghar`, Studio: `/studio`
- **Database:** Supabase — `https://kpojqhpyllzaxcpgmhmo.supabase.co` (Frankfurt)
- **Email:** Resend (pending `ghar-ngo.de` domain)
- **Payments:** PayPal (pending Business account)
- **i18n:** next-intl (EN/AR/DE + RTL)
- **Hosting:** Vercel — `https://ghar-seven.vercel.app`
- **Repo:** https://github.com/ibra8080/GHAR
- **Local Path:** `/Users/apple/Desktop/ana/GHAR/ghar-foundation/ghar-foundation`

---

## 🎨 Brand Colors
- Primary: `#1A6FA0` | Secondary: `#2D8F16` | Accent: `#EF8800` | Dark: `#2A2A2A` | BG: `#FCFCFA`

---

## 🔑 Environment Variables (Vercel + .env.local)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=eg9gx04a
NEXT_PUBLIC_SANITY_DATASET=ghar
NEXT_PUBLIC_SUPABASE_URL=https://kpojqhpyllzaxcpgmhmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fNx7V_VTzPS-5crWWnvzig_Wu6qNXbA
RESEND_API_KEY=re_QPS2X7pC_P496DX3ekVmhfcTxxVfioj3x
SANITY_API_TOKEN=*** (in Vercel env vars only)
```

---

## 📄 Pages & Status

| Page | Route | Sanity | Notes |
|------|-------|--------|-------|
| Home | `/` | ✅ | HeroSlides, Projects, Stats, News |
| About | `/about` | ✅ | Team, Partners, AboutContent |
| Projects | `/projects` | ✅ | Filter by country |
| Project Detail | `/projects/[id]` | ✅ | Slug-based routing |
| News | `/news` | ✅ | Pagination + year filter |
| Donate | `/donate` | ✅ | PayPal + Bank Transfer redesign |
| Volunteer | `/volunteer` | ✅ | Form + Jobs section |
| Jobs | `/jobs` | ✅ | NEW — list + detail pages |
| Jobs Detail | `/jobs/[id]` | ✅ | Apply via email |
| Contact | `/contact` | ✅ | NEW — form + Google Maps |
| Transparency | `/transparency` | ✅ | Fully connected to Sanity |
| Privacy | `/privacy` | ✅ | Single text field per language |
| Admin | `/admin/donations` | — | Password protected dashboard |

---

## 🗄️ Sanity Schemas (12 total)
1. `project` — humanitarian projects
2. `news` — news articles
3. `teamMember` — team members
4. `partner` — partner organizations
5. `heroSlide` — home page hero slides
6. `stat` — statistics (families, donations, countries)
7. `siteSettings` — contact info, social media, bank details (SINGLETON)
8. `aboutContent` — story, mission, vision, values (SINGLETON)
9. `job` — job listings
10. `pageSettings` — hero images for all pages (SINGLETON) — "Design Settings"
11. `transparencyContent` — allocations, reports, governance, certifications (SINGLETON)
12. `privacyContent` — privacy policy text EN/AR/DE (SINGLETON)

---

## 🗃️ Supabase Tables
- **contact_messages** → id, name, email, message, created_at
- **donors** → id, name, email, amount, donation_type, project, payment_method, paypal_tx_id, status, created_at
- **volunteers** → id, name, phone, email, country, specialty, availability, message, created_at

### RLS Policies Applied:
- `contact_messages`: INSERT ✅, SELECT ✅
- `donors`: INSERT ✅, SELECT ✅, UPDATE ✅
- `volunteers`: INSERT ✅

---

## 🏗️ Architecture Pattern
All pages follow **Server Component + Client Component** pattern:
- `page.tsx` — Server Component (fetches data from Sanity)
- `*Client.tsx` — Client Component (handles interactivity)

**Exception:** `transparency/page.tsx` → `TransparencyClient.tsx`, `admin/donations/page.tsx` (pure client)

---

## 📁 Key Files
```
proxy.ts                              → next-intl middleware (excludes: api, studio, admin)
i18n/routing.ts                       → defineRouting config
sanity/lib/queries.ts                 → ALL GROQ queries (12 functions)
sanity/lib/client.ts                  → Sanity client
sanity/schemaTypes/index.ts           → All schemas registered
lib/utils.ts                          → getCountryName(code, locale)
components/layout/Navbar.tsx          → i18n + language switcher
components/layout/Footer.tsx          → Sanity siteSettings + projects props
components/layout/CookieBanner.tsx    → GDPR
app/[locale]/layout.tsx               → Fetches: messages, siteSettings, projects → Footer
app/admin/donations/page.tsx          → Admin dashboard (password: ghar2026admin)
app/admin/layout.tsx                  → Admin layout with globals.css
app/api/ping/route.ts                 → Supabase keep-alive ping
vercel.json                           → Cron job (daily ping at 8am)
scripts/importAll.ts                  → Import heroSlides, stats, siteSettings, team, about
scripts/importToSanity.ts             → Import projects
scripts/importNews.ts                 → Import news
scripts/importJobs.ts                 → Import jobs
scripts/importTransparency.ts         → Import transparency content
scripts/importPrivacy.ts              → Import privacy policy
messages/en.json, ar.json, de.json    → All translations
```

---

## 🔄 Sanity Webhook
- **Vercel Deploy Hook** configured → auto-redeploy on Sanity content change
- URL stored in Sanity → API → Webhooks → `vercel-deploy`

---

## 💳 Donate Page — Payment Flow
1. User fills: name, email, amount, project, donation type
2. Data saved to Supabase with `status: "pending"` BEFORE payment
3. User selects payment method:
   - **PayPal** → redirects to PayPal (account pending)
   - **Bank Transfer** → shows bank details + thank you screen
   - **Card** → disabled "Coming Soon"
4. Admin updates status manually via `/admin/donations`

---

## 🔐 Admin Dashboard (`/admin/donations`)
- **URL:** `https://ghar-seven.vercel.app/admin/donations`
- **Password:** `ghar2026admin` ⚠️ (change before production launch)
- **Features:** Stats, table with filters, status update (Complete/Cancel/Pending), CSV export
- **Note:** Uses anon key — consider upgrading to service role for production

---

## ⚠️ Important Technical Notes
- `globals.css` uses `@theme inline` syntax — do NOT use standard Tailwind config
- Next.js 16 uses `proxy.ts` not `middleware.ts`
- Sanity singletons use `_id` + `createOrReplace`
- `suppressHydrationWarning` on `app/layout.tsx` html+body
- Supabase free tier sleeps after 7 days — Cron Job pings daily
- Admin password is hardcoded — upgrade to env var before launch

---

## ✅ Completed Features
- [x] Full i18n EN/AR/DE + RTL
- [x] SEO metadata all pages
- [x] GDPR Cookie Banner + Privacy Policy
- [x] All pages connected to Sanity CMS
- [x] Hero images manageable from "Design Settings" in Studio
- [x] Transparency page fully managed from Studio
- [x] Privacy Policy manageable from Studio
- [x] Jobs page + detail with email apply
- [x] Contact page with Google Maps (Kullenkampffallee 193, Bremen)
- [x] Donate redesign: PayPal + Bank Transfer + Card (coming soon)
- [x] Admin donations dashboard
- [x] Sanity Webhook → Vercel auto-deploy
- [x] Cron Job to prevent Supabase sleeping
- [x] Clickable cards with hover effects (Projects, News)
- [x] TypeScript ✅ ESLint ✅ Build ✅

---

## 🚀 Remaining Before Launch

### High Priority
- [ ] **Domain:** Connect `ghar-ngo.de` to Vercel
- [ ] **Resend:** Connect `ghar-ngo.de` for email delivery
- [ ] **PayPal Business:** Connect organization account
- [ ] **Admin Password:** Move to env var (currently hardcoded `ghar2026admin`)
- [ ] **Real Content:** Replace test data in Sanity Studio with real content

### Testing
- [ ] Firefox testing
- [ ] Opera testing
- [ ] Mobile Safari testing
- [ ] Full functional test on deployed site after domain connection

### Future Features
- [ ] PayPal Webhook → auto-update donation status to `completed`
- [ ] Email receipt/invoice via Resend after donation confirmed
- [ ] Stripe integration (after PayPal approval)
- [ ] DZI certification (after 2 years operation)
- [ ] Google Analytics (with cookie consent)
- [ ] README.md (final documentation)

---

## 🌐 Domains Purchased (Namecheap)
- `ghar-ngo.de` — **PRIMARY** (connect to Vercel)
- `ghar-ngo.com` — redirect to `.de`

---

## 📊 Sanity Plan
- Currently on **Growth Trial** — check expiry date
- Free plan sufficient for current needs after trial

---

## 💡 Key Decisions Made
- PayPal Giving Fund first → Stripe later
- Bank transfer: manual confirmation by admin via dashboard
- Admin dashboard at `/admin/donations` with password protection
- Launchgood button removed from donate page (no anonymous donations)
- Bank details hidden until donor fills form
- Values grid: 3 columns (flexible for admin to add/remove)
- News cards link to `/news` (no individual news detail pages yet)