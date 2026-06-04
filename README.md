# dinq-templates

Dinq Digital client site template library.
Clone a template, swap branding via env vars, deploy to Vercel in 2-4 hours.

Two tiers for every vertical: Standard (fast, conversion-focused) and 3D Interactive (premium, scroll-driven R3F experience).

---

## Structure

dinq-templates/
  _shared/
    tokens.css          Dinq design system — all 25 vertical colors
    dinq-agent.js       DinqAgent widget embed reference
    api-docs.md         API integration guide
    3d/
      ScrollScene.tsx   Reusable scroll camera system (all 3D templates)
      HtmlOverlay.tsx   Booking form rendered inside 3D scene
      tokens.ts         3D lighting and material presets per vertical
  next/
    restaurant/         Food truck — Standard — DONE
    restaurant-3d/      Food truck — 3D Interactive — PLANNED
    beauty/             Salon — Standard — PLANNED
    beauty-3d/          Salon — 3D Interactive — PLANNED
    auto/               Auto repair — Standard — PLANNED
    auto-3d/            Auto repair — 3D Interactive — PLANNED
    care/               Home care — Standard — PLANNED
    care-3d/            Home care — 3D Interactive — PLANNED
  astro/                SEO-heavy marketing sites — FUTURE
  html/                 Simple local business — FUTURE
  vue/                  Vue ecosystem clients — FUTURE

---

## Two Template Tiers

Standard
  Fast, conversion-focused, SEO-optimized.
  Fork of next/restaurant with vertical-specific pages and color swap.
  Deploy time: 2-4 hours per client.

3D Interactive
  Premium scroll-driven experience built with React Three Fiber.
  Camera moves through a 3D scene as user scrolls.
  Booking form appears inside the 3D scene at the destination.
  Built once per vertical, reuses the shared scroll system.
  Deploy time: custom build per vertical, then 2-4 hours per client.

Client pitch:
  Standard site for $X or the 3D interactive experience for $Y.
  Both connect to DinqPlus.

---

## Standard Build Order

1  next/restaurant   DinqServe  #E05D38  DONE
2  next/beauty       DinqBook   #6C5CE7  waiting for Nice Braids brief
3  next/auto         DinqShop   #3B82F6  waiting for G&M brief
4  next/care         DinqCare   #2E7D32  waiting for mukeracare brief

---

## 3D Build Order

1  next/auto-3d         Scroll through city to shop, book at door
   R3F examples: lulaby-city, gltf-animations-tied-to-scroll, camera-scroll

2  next/restaurant-3d   Scroll to food truck, menu pops up
   R3F examples: scrollcontrols-gltf, mixing-html-and-webgl

3  next/beauty-3d       Walk into salon, see services
   R3F examples: scrollcontrols-gltf, html-annotations

4  next/care-3d         Interactive neighborhood map
   R3F examples: scrollcontrols-gltf, html-markers

---

## 3D Tech Stack

All 3D templates share the same dependencies — all MIT licensed:

  @react-three/fiber          R3F core, React renderer for Three.js
  @react-three/drei           Helpers: ScrollControls, Html, shadows, effects
  @react-three/postprocessing Bloom, depth of field, chromatic aberration
  three                       Three.js core
  framer-motion               UI animations outside the 3D scene

Source:  github.com/pmndrs/examples (MIT)
Examples: r3f.docs.pmnd.rs/getting-started/examples

The scroll camera system in _shared/3d/ScrollScene.tsx is built once
for auto-3d then reused in every subsequent 3D template.

---

## Stack Decision Guide

Next.js Standard  booking, dynamic data, most clients
Next.js 3D        premium clients, memorable experience, upsell
Astro             pure marketing, SEO-heavy
HTML/CSS          simple local business, fastest delivery
Vue               clients with existing Vue ecosystem

Rule: pick the simplest stack that does the job.
A plumber does not need 3D. A premium auto shop might.

---

## Three Shared Primitives

1. DinqAgent widget
   Script tag embed. Any stack. Only renders if NEXT_PUBLIC_DINQ_AGENT_ID is set.

2. Contact form endpoint
   NEXT_PUBLIC_DINQ_ORG_ID set  -> posts to DinqPlus vertical
   Not set                      -> posts to dinqdigital.com/api/quote

3. Dinq design tokens
   _shared/tokens.css in every template. All 25 DinqPlus vertical colors.

---

## Three Client Tiers

Option 1  Standalone
  NEXT_PUBLIC_DINQ_ORG_ID=
  NEXT_PUBLIC_DINQ_AGENT_ID=
  Forms go to agency_quotes. No DinqPlus. No widget.

Option 2  Connected to DinqPlus
  NEXT_PUBLIC_DINQ_ORG_ID=their_org_id
  NEXT_PUBLIC_DINQ_AGENT_ID=
  Forms post to client DinqPlus vertical dashboard.

Option 3  DinqAgent Pro
  NEXT_PUBLIC_DINQ_ORG_ID=their_org_id
  NEXT_PUBLIC_DINQ_AGENT_ID=their_agent_id
  Full connection plus floating chat widget.

---

## Vertical Color Map

restaurant / restaurant-3d   DinqServe   #E05D38
beauty / beauty-3d           DinqBook    #6C5CE7
auto / auto-3d               DinqShop    #3B82F6
care / care-3d               DinqCare    #2E7D32
agency                       DinqAgency  #A67C52
guard                        DinqGuard   #06858E
factory                      DinqFactory #065F46
artist                       DinqArtist  #8B5CF6
fit                          DinqFit     #1E9DF1
events                       DinqEvents  #F59E0B
health                       DinqHealth  #0EA5E9

---

## Active Clients

Tasneem       food truck    next/restaurant      DinqServe  waiting for brief
Nice Braids   salon         next/beauty          DinqBook   waiting for brief
G&M Auto      auto repair   next/auto or auto-3d DinqShop   existing client
mukeracare    home care     next/care            DinqCare   existing client

---

## Deploying a New Client

1. Clone the relevant template folder
2. Copy .env.example to .env.local and fill in all vars
3. Swap /public assets (logo, hero, photos)
4. Update content in src/data/ or src/config/
5. vercel deploy

---

## DB Rules

Never create or modify tables directly.
All schema changes go through V1 DB chat.
Standalone leads go to agency_quotes via dinqdigital.com/api/quote.
