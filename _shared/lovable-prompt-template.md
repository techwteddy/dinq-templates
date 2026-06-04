# Lovable Prompt Template
# Dinq Digital — Standard Starting Block
#
# ALWAYS paste this block at the TOP of every Lovable prompt.
# Then add the client-specific brief below it.
# This prevents Lovable from defaulting to TanStack Start / SSR / Nitro.

---

## NON-NEGOTIABLES (paste this first, every time)

Build a static single-page React + Vite + Tailwind app.
NO TanStack Start. NO SSR. NO Nitro. NO router.
Single page with anchor link navigation only.
Export must be a plain Vite SPA — npm run build outputs to dist/.
Contact form must use fetch POST to https://dinqdigital.com/api/quote
Environment variable for order/booking URL: VITE_ORDER_URL
Add "Site by Dinq Digital" in the footer.

---

## WHEN TO USE LOVABLE

Use Lovable when:
- Client has strong visual brand (logo, colors, mockup already exists)
- Client is launching soon (less than 3 weeks)
- Site is mostly visual, not SEO-dependent
- Client drives traffic from social media not Google search

Do NOT use Lovable when:
- Client needs local SEO (auto repair near me, salon near me)
- Client needs DinqPlus connection from day one
- Site needs booking system or complex forms
- You have more than 2 weeks to build

---

## DEPLOY RULE FOR LOVABLE EXPORTS

Lovable exports two zips — always ask for both:
- tsspoon-spa.zip        full source code (for GitHub)
- tsspoon-spa-dist.zip   pre-built static files (for instant deploy)

Deploy the dist zip to Netlify drag and drop.
Push the source zip to GitHub for version control.
Never deploy Lovable exports to Vercel — use Netlify.

Stack decision:
  next/*   → Vercel
  vite/*   → Netlify
  html/*   → Netlify or GitHub Pages
  astro/*  → Netlify or Vercel

---

## FULL PROMPT STRUCTURE

[NON-NEGOTIABLES BLOCK above]

Build a website for [CLIENT NAME].
Business type: [type]
Location: [city, state]
Tagline: [tagline]

BRAND & COLORS
- Background: [hex]
- Accent: [hex]
- Font: [heading font], [body font]
- Vibe: [describe the aesthetic]

SECTIONS (in this order)
1. Navbar — sticky, glass blur, mobile hamburger, links: [list]
2. Hero — full viewport, headline: "[text]", subheading: "[text]", CTA buttons: "[label]"
3. [Section name] — [describe layout and content]
4. [Section name] — [describe layout and content]
5. Contact — form with Name, Email, Phone, Message, [dropdown if needed]
   Form posts via fetch POST to https://dinqdigital.com/api/quote
6. Footer — business name, tagline, social links, "Site by Dinq Digital"

SOCIAL LINKS
- Instagram: @[handle]
- TikTok: @[handle]
- Email: [email]

TECHNICAL REQUIREMENTS
- React + Vite + Tailwind — NO TanStack, NO SSR
- Framer Motion for scroll animations
- Mobile first, fully responsive
- Dark mode only (if applicable)
- All sections smooth scroll anchor links
- Contact form fetch POST to https://dinqdigital.com/api/quote
- VITE_ORDER_URL env var for any order/booking button

---

## ACTIVE CLIENT REFERENCE

T$ Spoon — tsspoon-website — Netlify — glittery-baklava-cb33d0.netlify.app
Vertical: DinqServe | Color: #B87333 | Location: Seattle/Bellevue WA
Status: Live preview sent to client, awaiting Square link and pricing confirmation
