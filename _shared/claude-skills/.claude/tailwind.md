---
name: tailwind
description: Tailwind CSS development skill. Covers utility-first styling, custom configurations, responsive design patterns, component styling with @apply, dark mode, animations, and integration with React/Next.js. Prefers modern Tailwind v4 patterns when applicable.
user-invocable: true
---

# Tailwind CSS Development Skill

## What this Skill is for

Use this Skill when the user asks for:

- Styling components with Tailwind CSS
- Custom Tailwind configuration
- Responsive design implementation
- Dark mode setup and theming
- Custom animations and transitions
- Tailwind plugin usage or creation
- Migration between Tailwind versions

## Default stack decisions (opinionated)

1. **Tailwind v4 first**

- Prefer CSS-first configuration (CSS variables over JS config where possible)
- Use `@theme` directive for theme customization
- Prefer `@layer` for custom utilities

2. **Utility-first approach**

- Prefer inline utilities over `@apply` when reasonable
- Use `@apply` only for truly repeated patterns in component libraries
- Group related utilities logically (layout → spacing → typography → colors → effects)

3. **Responsive design**

- Mobile-first by default
- Use breakpoint prefixes consistently: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Prefer container queries (`@container`) for component-level responsiveness

4. **Dark mode**

- Prefer `class` strategy for manual control
- Use CSS variables for theme colors to enable easy switching
- Keep dark mode variants close to their light counterparts

5. **Performance**

- Avoid arbitrary values when design tokens exist
- Use Tailwind's built-in purging (automatic in v4)
- Prefer `group` and `peer` over complex JS state for interactive styles

## Operating procedure

### 1. Classify the styling task

- New component styling
- Existing component modification
- Global theme changes
- Animation/transition work
- Responsive layout adjustments

### 2. Pick the right approach

- Simple one-off styles: inline utilities
- Repeated patterns: component extraction or `@apply`
- Theme-wide changes: `tailwind.config.js` or `@theme`
- Complex interactions: `group`, `peer`, or CSS variables

### 3. Implementation guidelines

**Utility ordering convention:**

```
layout (display, position, flex/grid)
→ sizing (width, height)
→ spacing (margin, padding, gap)
→ typography (font, text)
→ colors (bg, text color, border color)
→ borders (border width, radius)
→ effects (shadow, opacity)
→ transitions/animations
→ responsive/state variants
```

**Common patterns:**

```tsx
// Flexbox centering
<div className="flex items-center justify-center">

// Card pattern
<div className="rounded-lg border bg-card p-6 shadow-sm">

// Interactive button
<button className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">

// Responsive grid
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
```

### 4. Dark mode implementation

```tsx
// Component with dark mode
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">

// Using CSS variables (preferred)
<div className="bg-background text-foreground">
```

### 5. Custom configuration (tailwind.config.js)

```js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        background: 'hsl(var(--background))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
```

## Common utilities reference

**Layout:** `flex`, `grid`, `block`, `hidden`, `relative`, `absolute`, `fixed`, `sticky`
**Spacing:** `p-{n}`, `m-{n}`, `gap-{n}`, `space-x-{n}`, `space-y-{n}`
**Sizing:** `w-{n}`, `h-{n}`, `min-w-{n}`, `max-w-{n}`, `size-{n}`
**Typography:** `text-{size}`, `font-{weight}`, `leading-{n}`, `tracking-{n}`
**Colors:** `bg-{color}`, `text-{color}`, `border-{color}`
**Borders:** `border`, `border-{n}`, `rounded-{size}`
**Effects:** `shadow-{size}`, `opacity-{n}`, `blur-{n}`
**Transitions:** `transition`, `duration-{n}`, `ease-{type}`

## Integration with shadcn/ui

When using shadcn/ui:

- Use the provided CSS variables for theming
- Follow the component patterns from the registry
- Prefer `cn()` utility for conditional classes
- Keep customizations in the component file, not globally
