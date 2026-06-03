# Dinq Templates — API & Integration Docs

Every template in dinq-templates shares the same three primitives:
1. DinqAgent widget embed
2. Contact form endpoint
3. Dinq design tokens

---

## Form Routing Logic

If NEXT_PUBLIC_DINQ_ORG_ID is set:
  POST to dinqplus.app/api/book/[slug]
  Phase 2: POST to dinqplus.app/api/external/contact

If not set:
  POST to dinqdigital.com/api/quote (saves to agency_quotes table)

If NEXT_PUBLIC_DINQ_AGENT_ID is set:
  DinqAgent widget renders (DinqPlus Pro only)

If not set:
  Widget is invisible, no broken UI

---

## Contact Form Payload

name     - string, required
email    - string, required
phone    - string, optional
business - string, client business name
vertical - string, e.g. restaurant, salon, auto
message  - string, optional
source   - string, template slug
meta:
  event_type           - string, enquiry type
  subscribe_newsletter - boolean
  org_id               - string or null

---

## Public DinqPlus API Endpoints (live now)

GET  dinqplus.app/api/careers/jobs         - Public job listings
GET  dinqplus.app/api/book/[slug]          - Public booking page data
GET  dinqplus.app/api/intelligence/briefing - Org briefing (auth required)
GET  dinqplus.app/api/intelligence/stats   - Org stats (auth required)

## Phase 2 Endpoints (coming soon)

POST dinqplus.app/api/external/booking - Accept bookings via org_id
POST dinqplus.app/api/external/contact - Accept contact forms via org_id
POST dinqplus.app/api/external/order   - Accept orders via org_id

---

## DinqAgent Widget

Next.js App Router — add to root layout.tsx:
  src="https://dinqdigital.com/agent/widget.js"
  data-agent-id=YOUR_AGENT_ID
  data-client-name=Business Name
  data-accent=#E05D38
  data-position=bottom-right
  strategy=lazyOnload
  Only render if NEXT_PUBLIC_DINQ_AGENT_ID is set

Plain HTML or Astro — add before closing body tag:
  script src="https://dinqdigital.com/agent/widget.js"
  data-agent-id=YOUR_AGENT_ID
  data-client-name=Business Name
  data-accent=#E05D38
  defer

---

## Environment Variables (all templates)

NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BUSINESS_NAME=
NEXT_PUBLIC_SITE_DESCRIPTION=
NEXT_PUBLIC_THEME_COLOR=
NEXT_PUBLIC_DINQ_ORG_ID=
NEXT_PUBLIC_DINQ_AGENT_ID=
NEXT_PUBLIC_DINQ_VERTICAL=
NEXT_PUBLIC_DINQ_PRIMARY_COLOR=

---

## Vertical to DinqPlus Mapping

restaurant  - DinqServe  - #E05D38
salon       - DinqBook   - #6C5CE7
auto        - DinqShop   - #3B82F6
care        - DinqCare   - #2E7D32
agency      - DinqAgency - #A67C52
guard       - DinqGuard  - #06858E
factory     - DinqFactory - #065F46
artist      - DinqArtist - #8B5CF6
learn       - DinqLearn  - #171717
fit         - DinqFit    - #1E9DF1
events      - DinqEvents - #F59E0B
health      - DinqHealth - #0EA5E9

---

## Active Clients

Tasneem food truck  - restaurant - DinqServe - org_id TBD
Nice Braids         - salon      - DinqBook  - org_id TBD
G&M Auto Repair     - auto       - DinqShop  - org_id TBD
mukeracare          - care       - DinqCare  - org_id TBD

---

## DB Rules

All standalone leads post to agency_quotes via dinqdigital.com/api/quote
Never create or modify tables directly — all schema changes go through V1 DB chat
The meta JSONB column handles vertical-specific fields without schema changes
