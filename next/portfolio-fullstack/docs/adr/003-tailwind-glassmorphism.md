# ADR 003 — Tailwind CSS with Glassmorphism Visual Pattern

**Date:** 2025-01-01  
**Status:** Accepted

---

## Context

Styling approach had to balance development speed, visual consistency, and maintainability. Options considered: Tailwind CSS, CSS Modules, styled-components, plain CSS.

## Decision

Use **Tailwind CSS** as the sole styling system, with a **glassmorphism card pattern** applied consistently to all content cards.

## Reasons

### Tailwind CSS
- Utility-first keeps styles co-located with markup — no context switching between `.tsx` and `.css` files.
- Purges unused styles at build time, keeping the CSS bundle minimal.
- Tailwind's responsive prefix system (`lg:`, `sm:`) makes the mobile-first layout explicit and readable.
- No naming conventions to maintain (BEM, etc.).

### Glassmorphism pattern
- Creates visual depth on the dark background without heavy box shadows or gradients per-card.
- A single consistent style (`rgba(255,255,255,0.1)` + `blur(12px)` + `rgba(255,255,255,0.2)` border) makes all cards feel like a cohesive system.
- The pattern is implemented as inline `style` (not a Tailwind class) because `backdrop-filter` and `rgba` values are not part of the standard Tailwind config without extensions.

## Consequences

- Do not introduce CSS Modules, styled-components, or any other CSS-in-JS system. Use Tailwind classes and inline styles where Tailwind falls short.
- The glassmorphism values (`rgba(255,255,255,0.1)`, `blur(12px)`, `rgba(255,255,255,0.2)`) must not be changed on individual cards. If the design changes, update all cards together.
- New UI elements that are "card-like" must use the glassmorphism pattern for visual consistency.
- The two accent gradients (`teal-400 → blue-500` and `purple #9333ea → blue #3b82f6`) are the only gradients in the project. Do not introduce other gradient combinations.
