# dinq-templates

Dinq Digital client site template library.
Clone a template, swap branding via env vars, deploy to Vercel in 2-4 hours.

---

## Structure

dinq-templates/
  _shared/
    tokens.css      Dinq design system CSS variables (all 25 verticals)
    dinq-agent.js   DinqAgent widget embed reference
    api-docs.md     API integration guide
  next/
    restaurant/     Food truck / restaurant (Next.js 15) — ACTIVE
    beauty/         Salon / beauty studio — coming soon
    auto/           Auto repair — coming soon
    care/           Home care — coming soon
  astro/            Marketing sites, SEO-heavy — coming soon
  html/             Simple local business — coming soon
  vue/              Vue ecosystem clients — coming soon

---

## Stack Decision Guide

Next.js   — booking systems, dynamic data, online ordering
Astro     — pure marketing sites, blogs, SEO-heavy
HTML/CSS  — simple local business, fastest delivery
Vue       — clients with existing Vue ecosystem

Rule: pick the simplest stack that does the job.

---

## The Three Shared Primitives

These must be consistent across ALL templates regardless of stack:

1. DinqAgent widget
   Embedded as a script tag. Works on any stack.
   Only renders if NEXT_PUBLIC_DINQ_AGENT_ID is set.

2. Contact form endpoint
   If NEXT_PUBLIC_DINQ_ORG_ID is set: posts to DinqPlus vertical
   If not set: posts to dinqdigital.com/api/quote

3. Dinq design tokens
   Same CSS variables in every template via _shared/tokens.css
   All 25 DinqPlus vertical colors included.

---

## Three Client Tiers

Option 1 — Standalone website only
  NEXT_PUBLIC_DINQ_ORG_ID=    (leave blank)
  NEXT_PUBLIC_DINQ_AGENT_ID=  (leave blank)
  Forms post to agency_quotes. No DinqPlus. No widget.

Option 2 — Website connected to DinqPlus
  NEXT_PUBLIC_DINQ_ORG_ID=their_org_id
  NEXT_PUBLIC_DINQ_AGENT_ID=  (leave blank)
  Forms post to client DinqPlus vertical dashboard.

Option 3 — Website with DinqAgent (Pro)
  NEXT_PUBLIC_DINQ_ORG_ID=their_org_id
  NEXT_PUBLIC_DINQ_AGENT_ID=their_agent_id
  Full connection plus floating chat widget.

---

## Deploying a New Client

1. Clone the relevant template folder
2. Copy .env.example to .env.local
3. Fill in all NEXT_PUBLIC_ vars
4. Swap /public assets (logo, hero images, photos)
5. Update content in src/data/ or src/config/
6. vercel deploy

---

## Vertical to DinqPlus Color Map

restaurant  DinqServe   #E05D38
salon       DinqBook    #6C5CE7
auto        DinqShop    #3B82F6
care        DinqCare    #2E7D32
agency      DinqAgency  #A67C52
guard       DinqGuard   #06858E
factory     DinqFactory #065F46
artist      DinqArtist  #8B5CF6
fit         DinqFit     #1E9DF1
events      DinqEvents  #F59E0B
health      DinqHealth  #0EA5E9

---

## Active Clients

Tasneem       food truck   next/restaurant   DinqServe
Nice Braids   salon        next/beauty       DinqBook
G&M Auto      auto repair  next/auto         DinqShop
mukeracare    home care    next/care         DinqCare

---

## DB Rules

Never create or modify tables directly.
All schema changes go through V1 DB chat.
Leads from standalone sites go to agency_quotes via dinqdigital.com/api/quote.
