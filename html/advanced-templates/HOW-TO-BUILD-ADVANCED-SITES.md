# HOW TO BUILD ADVANCED IMMERSIVE WEBSITES WITH CLAUDE

Use this guide to prompt Claude to build high-end, visually impressive websites
for any category — similar to sites seen on videos like Active Theory or Pioneer Seeds.

---

## WHAT MAKES THESE SITES DIFFERENT

Standard Claude websites = hero + features + pricing + footer with a gradient background.

Advanced Claude websites = cinematic storytelling, particle systems, glitch effects,
custom cursors, scroll-driven reveals, immersive typography, and zero generic AI layout.

The difference is entirely in how you prompt.

---

## THE MASTER PROMPT TEMPLATE

Copy this and fill in the [BRACKETS] for any project:

```
Build me a single-file advanced HTML/CSS/JS website for [BUSINESS TYPE].

VISUAL STYLE: [choose one or describe your own]
- Immersive Dark Scroll — dark background, particle network, scroll-driven section reveals,
  cinematic typography, left-aligned storytelling layout
- Glitch Cyberpunk — dark bg with glow orbs, glitch text effects, side navigation,
  monospace/terminal aesthetic, grid-based work portfolio
- Luxury Minimal — pure white/black, ultra-thin type, magnetic hover effects,
  horizontal scroll sections, refined spacing
- Nature Organic — earthy tones, soft particle bloom, layered SVG shapes,
  smooth parallax, editorial layout
- Tech Futurist — neon accents, grid lines, hologram-style cards,
  data readout animations, strong geometric shapes

MUST INCLUDE:
- Canvas-based animated background (particles, orbs, or atmospheric effect)
- Custom CSS cursor (dot + ring or crosshair style)
- Scroll-triggered reveal animations on every section (IntersectionObserver)
- At least one marquee/ticker strip
- Cinematic hero with large display typography and animated entrance
- Interactive hover states that transform cards, rows, or images
- Clip-path cut-corner buttons (angular, not round)
- Side navigation OR scroll progress indicators
- Contact/CTA section with a styled form
- Sticky top nav with blur backdrop

LAYOUT RULES:
- Do NOT use centered hero text with generic button underneath as the only layout
- Do NOT use gradient blob backgrounds unless they move or react to the mouse
- Do NOT repeat the same card layout in more than one section
- Each section must feel structurally different from the last
- The site must feel custom to [BUSINESS TYPE], not like a template

BRAND:
- Primary color: [COLOR or "derive from the industry"]
- Secondary/accent: [COLOR or "derive from the industry"]
- Typography feel: [serif/sans/monospace/mixed]
- Tone: [dark/light/mixed]

CONTENT SECTIONS (in any order that makes sense):
- Hero — [headline idea or "write something cinematic for this industry"]
- Stats or social proof strip
- Storytelling section (left-aligned narrative with section numbers)
- Image/visual panel strip (expandable hover panels)
- Feature cards (3 columns, top-border reveal on hover)
- Services list (full-width rows, hover to expand)
- Quote or testimonial (large, centered)
- Final CTA section
- Footer

OUTPUT: One complete self-contained HTML file. No external dependencies except
optionally Three.js or GSAP from cdnjs.cloudflare.com if needed.
```

---

## CATEGORY-SPECIFIC PROMPT EXAMPLES

### Real Estate / Luxury Property
```
Build an advanced single-file website for a luxury real estate agency.
Visual style: Luxury Minimal — clean black and white, gold accents, ultra-thin serif type,
magnetic cursor that warps toward interactive elements, horizontal image scroll on desktop,
properties shown as expanding image panels not cards.
Brand colors: #0a0a0a, #ffffff, #b8965a (gold)
Tone: Dark, refined, premium
Sections: Full-screen hero with address-style headline,
stats band (properties sold, years active, avg sale price),
featured listings as image panels that expand on hover,
agent philosophy quote, services list with hover rows,
contact form with minimal styled inputs.
Custom cursor: gold dot + slow-following ring.
Include scroll progress dots on the left side.
```

### Fitness / Gym / Training
```
Build an advanced single-file website for an elite personal training studio.
Visual style: Tech Futurist — dark bg (#080810), electric blue (#0ff) and red (#f00) accents,
grid line background pattern, data-readout style stats, aggressive bold sans-serif,
sharp clip-path elements on all buttons and cards.
Brand colors: #080810, #00ffff, #ff2222
Tone: Intense, high-performance, aggressive
Sections: Full-screen hero with full-width bold typography (TRAIN. ADAPT. DOMINATE.),
performance stats ticker, program cards with sharp hover reveals,
coach profile row-list, transformation results grid,
CTA section with a large background number, sign-up form.
Background: animated grid lines that pulse in sync with a heartbeat timing function.
```

### Restaurant / Food / Hospitality
```
Build an advanced single-file website for a high-end restaurant.
Visual style: Nature Organic meets Luxury — warm deep tones (#1a0f08, #2d1a0e),
soft amber/cream accents (#e8c87a, #f5f0e8), editorial layout with asymmetric sections,
smooth scroll parallax on hero, ingredients floating as particles,
large serif headlines mixed with small caps labels.
Brand colors: #1a0f08, #e8c87a, #f5f0e8
Typography: Serif headings, monospace small caps for labels
Sections: Full-screen hero with dish name and tagline in editorial layout,
story section about the chef/origin, menu categories as expandable panels,
reservation CTA, gallery image strip, press quotes, contact.
```

### Music Artist / DJ / Band
```
Build an advanced single-file website for a DJ or music artist.
Visual style: Glitch Cyberpunk — full dark (#000), neon purple (#a855f7) and electric yellow
(#facc15), glitch text effect on artist name, waveform visualization using Canvas,
music player bar at bottom, aggressive uppercase monospace type.
Brand colors: #000000, #a855f7, #facc15
Tone: Dark, underground, high-energy
Sections: Full-screen hero with glitch effect on artist name, animated audio bars in background,
upcoming shows list with hover glow rows, discography cards with album art placeholders,
press logos, booking contact form styled as a terminal input.
Bottom of page: sticky fake audio player bar.
```

### Creative Agency / Portfolio
```
Build an advanced single-file website for a creative digital agency.
Visual style: Glitch Cyberpunk — bg #050508, purple/cyan palette, side navigation,
terminal-style hero with typewriter effect, work grid with scan-line hover reveal,
service list rows that expand on hover, glowing status dot in top bar.
Brand colors: #050508, #7c3aed, #06b6d4
Sections: Side nav + top bar, hero with terminal code block,
marquee ticker of services, 6-card work grid, 4-item service row list,
large testimonial quote, contact form with cut-corner buttons.
```

### Fashion / Streetwear / Apparel
```
Build an advanced single-file website for a streetwear brand.
Visual style: Luxury Minimal but edgy — stark white (#fafafa) background,
pure black (#000) type, one bold accent color (#e11d48 red),
ultra-large typography that bleeds off screen, horizontal scroll product strip,
polaroid-style product images with slight tilt, cursor that leaves a color trail.
Brand colors: #fafafa, #000000, #e11d48
Sections: Hero with a single massive word (the brand name) and a thin subline,
product strip (horizontal scroll on desktop), brand manifesto block in large type,
lookbook grid with hover zoom, stockists list, newsletter form.
```

### Tech Startup / SaaS
```
Build an advanced single-file website for a B2B SaaS product.
Visual style: Tech Futurist — dark navy (#030712), electric indigo (#6366f1) and teal (#14b8a6),
animated node/connection graph in the background (Canvas), product dashboard mockup
shown as a glowing card in the hero, code snippet terminal visible on hero.
Brand colors: #030712, #6366f1, #14b8a6
Sections: Hero with split layout (left: headline + CTA, right: glowing dashboard card),
logo ticker of client brands, 3 feature cards with icon reveals,
before/after comparison section, pricing table (3 tiers with cut-corner styling),
testimonial carousel, footer with links.
```

---

## QUICK POWER-UPS TO ADD TO ANY PROMPT

Add any of these lines to any prompt above for extra visual power:

| Add-on | Prompt phrase |
|---|---|
| Mouse-reactive particles | "Particles react to mouse position — repel near cursor" |
| Glitch on hover | "Hero title glitches (CSS clip-path animation) on hover" |
| Typewriter effect | "Headline types itself out on page load" |
| Smooth page cursor | "Custom cursor: small dot + slow-lagging outer ring" |
| Magnetic buttons | "Buttons subtly attract the cursor when it comes within 60px" |
| Scroll counter | "Side progress indicator shows which section is active" |
| Noise texture overlay | "Add subtle grain/noise texture overlay to entire page" |
| Video background | "Hero background is a darkened looping video (use placeholder)" |
| Horizontal scroll strip | "One section scrolls horizontally instead of vertically" |
| Parallax layers | "Hero has 2-3 depth layers that move at different scroll speeds" |
| Split text reveal | "Section headings split into letters and stagger-animate in" |
| Count-up numbers | "Stats section counts up from 0 when it scrolls into view" |
| Expanding panels | "Image gallery uses expandable flex panels instead of a grid" |

---

## RULES FOR CLAUDE TO FOLLOW (already in CLAUDE.md, reinforced here)

When building advanced sites, Claude must:

1. State the layout style, background style, and color plan BEFORE writing any code
2. Make every section structurally different — no two sections look the same
3. Use brand colors, not generic AI purple-blue gradients
4. Include at least one Canvas-based animation (not just CSS gradients)
5. Include a custom cursor
6. Include scroll-triggered reveal animations on all sections
7. NOT use centered hero + feature cards + pricing + footer as the only page structure
8. NOT use glassmorphism as a style substitute — it's overused
9. NOT use generic rounded cards as the only content container
10. Build as one self-contained HTML file (no external CSS/JS files needed)

---

## FILES IN THIS FOLDER

| File | Description |
|---|---|
| `immersive-scroll-storytelling.html` | Dark green + gold, particle network, scroll-driven, Pioneer Seeds style |
| `glitch-creative-agency.html` | Cyberpunk dark, glitch text, side nav, Active Theory style |
| `HOW-TO-BUILD-ADVANCED-SITES.md` | This file — prompts for any category |

---

*Built for Claude Cowork Mode · Website Projects / Website Templates / Advanced Templates*
