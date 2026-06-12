# Component Reference

Each section component is self-contained: it owns its data, its local UI state, and its markup.
Components do not share state with each other and do not use React Context.

---

## Navbar

**File:** `src/components/Navbar.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Fixed top navigation bar with smooth-scroll links and a mobile hamburger menu.

### Behavior
- Fixed at the top with `z-50` and `backdrop-blur-lg` background.
- Desktop: horizontal link list (hidden on `< lg`).
- Mobile: hamburger button toggles a vertical dropdown.
- Clicking any link closes the mobile menu and smooth-scrolls to the target section by `id`.

### Local state
| State | Type | Purpose |
|---|---|---|
| `isMobileMenuOpen` | `boolean` | Controls mobile menu visibility |

### Sections targeted
`#hero`, `#skills`, `#projects`, `#timeline`, `#contact`

### Do not
- Add external links to the nav.
- Add authentication or user-specific items.
- Change the `z-50` value — it must stay above all section content and modals.

---

## Hero

**File:** `src/components/Hero.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Full-screen introduction section with profile photo, name, role, social links, typewriter animation, and CV download.

### Layout
Two-column (`lg:flex-row`): left = glassmorphism card with photo + info; right = typewriter + description.

### Key elements
| Element | Detail |
|---|---|
| Profile photo | `next/image` from `github.com/ghiberti85.png`, `priority` loading |
| Typewriter | `typewriter-effect` (dynamic import, SSR disabled) |
| Social icons | GitHub, LinkedIn, Email — Font Awesome brand icons |
| CV download | `<a href="/fernando-ghiberti-cv-en.pdf" download>` |

### Do not
- Replace the `priority` prop on the profile image — it is the LCP element.
- Add the Typewriter to SSR — it is intentionally `ssr: false`.
- Add a contact form here — that belongs in `<Contact />`.

---

## SkillsSlider

**File:** `src/components/SkillsSlider.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Displays skill cards in two auto-scrolling carousels (one LTR, one RTL).

### Data shape
```ts
interface Skill {
  name: string;
  icon: string;  // absolute URL to SVG/PNG icon
  level: number; // 0–100, rendered as a progress bar
}
```

Data is defined in the `skills` array at the top of the file. Split at midpoint: first half → slider 1 (LTR), second half → slider 2 (RTL).

### Slider config
- `autoplay: true`, `autoplaySpeed: 2000`, `infinite: true`
- `slidesToShow: 5` (desktop), `3` (tablet), `1` (mobile)
- No arrows, no dots
- Second slider uses `rtl={true}` for reverse direction

### Do not
- Add click handlers to skill cards — they are display-only.
- Change `autoplaySpeed` below 1500 — it causes visual jitter on low-end devices.
- Use local image files for skill icons — use CDN URLs (`cdn.jsdelivr.net` or `static.cdnlogo.com`, both allowed in `remotePatterns`).

---

## ProjectsGrid

**File:** `src/components/ProjectsGrid.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Filterable, paginated project grid with a modal detail view per project.

### Data shape
```ts
interface Project {
  title: string;
  image: string;    // absolute URL
  description: string;
  github: string;   // GitHub repo URL
  live: string;     // live demo URL, or empty string ""
  tags: string[];   // used for filter buttons
}
```

Data is defined in the `projects` array at the top of the file.

### Local state
| State | Type | Purpose |
|---|---|---|
| `visibleProjects` | `number` | How many cards to show (starts at 6) |
| `selectedProject` | `Project \| null` | Currently open modal |
| `activeTag` | `string \| null` | Active filter tag (`null` = All) |

### Behavior
- Default: 6 projects visible, "See More" button loads all.
- Tag filter: clicking a tag shows only matching projects and removes pagination.
- Modal: clicking a card or "View more" opens the detail modal. Clicking the overlay or ✕ closes it.
- Live link only renders in the modal if `project.live` is non-empty.

### Do not
- Fetch project data from an external API — keep it in the static array.
- Render the `live` link if the URL is an empty string (already guarded in the component).
- Change the initial visible count below 6 without updating the `test:coverage` tests.

---

## Timeline

**File:** `src/components/Timeline.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Alternating vertical timeline of professional experience and education entries, with a modal detail view.

### Data shape
```ts
interface TimelineItem {
  title: string;
  period: string;
  type: "professional" | "education";
  institution: string;
  location: string;
  details: string[];  // bullet points shown in the modal
}
```

Data is defined in the `timelineData` array at the top of the file.

### Layout
- Vertical line centered on the page.
- Even-indexed items align left (`self-start`), odd-indexed align right (`self-end`).
- Icon: briefcase for `professional`, graduation cap for `education`.

### Local state
| State | Type | Purpose |
|---|---|---|
| `selectedItem` | `TimelineItem \| null` | Currently open modal |

### Do not
- Change the alternating left/right logic without testing at both `md` and `sm` breakpoints.
- Add inline details to the card — details belong only in the modal to keep cards compact.

---

## Contact

**File:** `src/components/Contact.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Contact section with four channel cards: Email, WhatsApp, LinkedIn, GitHub.

### Cards
| Card | href |
|---|---|
| Email | `mailto:ghiberti85@gmail.com` |
| WhatsApp | `https://wa.me/5511996186115?text=...` |
| LinkedIn | `https://www.linkedin.com/in/ghiberti85/` |
| GitHub | `https://github.com/ghiberti85` |

### Do not
- Add a contact form with a backend handler — this project has no API routes (see ADR 002).
- Change the `target="_blank"` links without keeping `rel="noopener noreferrer"`.
- Add new contact channels without a corresponding Font Awesome icon.

---

## Footer

**File:** `src/components/Footer.tsx`  
**Type:** Client Component (`"use client"`)  
**Responsibility:** Author credit line and a floating "Back to Top" button that appears after the skills section.

### Behavior
- Listens to `window.scroll` and compares `scrollY` against the bottom of `#skills`.
- Back-to-top button renders only when `showBackToTop === true`.
- Clicking the button calls `window.scrollTo({ top: 0, behavior: "smooth" })`.

### Local state
| State | Type | Purpose |
|---|---|---|
| `showBackToTop` | `boolean` | Controls button visibility |

### Do not
- Add navigation links here — they belong in `<Navbar />`.
- Add social links here — they are in `<Hero />` and `<Contact />`.

---

## Adding a New Component

1. Create `src/components/MyComponent.tsx`
2. Add `"use client"` if it uses state, effects, or browser APIs
3. Use the glassmorphism card pattern for any card-like UI (see `docs/ARCHITECTURE.md`)
4. Create `src/__tests__/MyComponent.test.tsx` with at minimum:
   - Renders without crashing
   - Key content is visible
   - Interactions work (if any)
5. Import and add it to `src/app/page.tsx` in the correct sequence
6. Add a section `id` attribute for Navbar scroll targeting if it is a full page section
7. Update `README.md` features section and this file

## Removing a Component

1. Delete `src/components/MyComponent.tsx`
2. Delete `src/__tests__/MyComponent.test.tsx`
3. Remove its import from `src/app/page.tsx`
4. Remove its `id` from the Navbar links if applicable
5. Update `README.md` and this file
