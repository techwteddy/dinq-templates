---
name: style-system
description: Design system and style conventions skill. Covers component patterns, design tokens, theming, accessibility, and consistent styling practices. Ensures visual consistency across the codebase.
user-invocable: true
always-apply: true
---

# Style System Skill

## What this Skill is for

Use this Skill when the user asks for:

- Creating or modifying UI components
- Design token usage
- Theming and dark mode
- Accessibility compliance
- Consistent spacing, typography, and colors
- Component composition patterns

## ALWAYS CHECK BEFORE STYLING

Before writing any styles, check:

1. **Existing design tokens** in `tailwind.config.ts` and `globals.css`
2. **Existing components** in `src/components/ui/`
3. **Color palette** already defined
4. **Spacing scale** being used
5. **Typography scale** (font sizes, weights, line heights)

## Design token conventions

### Colors (CSS variables in globals.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode overrides */
}
```

### Using tokens in Tailwind

```tsx
// Use semantic tokens, not raw colors
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
<p className="text-muted-foreground" />
<div className="border-border" />
```

### Spacing scale

Use consistent spacing from Tailwind's scale:

- `0.5` (2px) - Micro spacing
- `1` (4px) - Tight spacing
- `2` (8px) - Compact spacing
- `3` (12px) - Default gap
- `4` (16px) - Standard spacing
- `6` (24px) - Comfortable spacing
- `8` (32px) - Section spacing
- `12` (48px) - Large sections
- `16` (64px) - Page sections

```tsx
// Consistent spacing patterns
<div className="space-y-4">      {/* Standard vertical rhythm */}
<div className="gap-3">          {/* Default grid/flex gap */}
<div className="p-4 md:p-6">     {/* Responsive padding */}
```

### Typography scale

```tsx
// Headings
<h1 className="text-4xl font-bold tracking-tight" />
<h2 className="text-3xl font-semibold tracking-tight" />
<h3 className="text-2xl font-semibold" />
<h4 className="text-xl font-semibold" />

// Body
<p className="text-base" />                    {/* Default */}
<p className="text-sm text-muted-foreground" /> {/* Secondary */}
<span className="text-xs" />                   {/* Small/labels */}

// Special
<p className="text-lg leading-relaxed" />      {/* Large body */}
<code className="font-mono text-sm" />         {/* Code */}
```

## Component patterns

### Button variants

```tsx
// Primary action
<Button>Submit</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Ghost (subtle)
<Button variant="ghost">Menu</Button>

// Outline
<Button variant="outline">Export</Button>

// Link style
<Button variant="link">Learn more</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Card pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Actions */}</CardFooter>
</Card>
```

### Form pattern

```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
    <p className="text-sm text-muted-foreground">Helper text</p>
  </div>

  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input id="password" type="password" />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>

  <Button type="submit" className="w-full">
    Sign in
  </Button>
</form>
```

### Layout patterns

```tsx
// Page container
<div className="container mx-auto px-4 py-8">

// Centered content (narrow)
<div className="mx-auto max-w-2xl">

// Two-column layout
<div className="grid grid-cols-1 gap-8 md:grid-cols-2">

// Sidebar layout
<div className="flex">
  <aside className="w-64 shrink-0" />
  <main className="flex-1" />
</div>

// Stack with consistent spacing
<div className="flex flex-col gap-4">
```

## Accessibility requirements

### Color contrast

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Use `text-foreground` on `bg-background`
- Use `text-primary-foreground` on `bg-primary`

### Focus states

```tsx
// Always visible focus rings
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">

// Using cn() for consistency
className={cn(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  className
)}
```

### Interactive elements

```tsx
// Buttons need accessible names
<Button aria-label="Close menu">
  <XIcon />
</Button>

// Form inputs need labels
<Label htmlFor="email">Email</Label>
<Input id="email" />

// Loading states
<Button disabled aria-busy="true">
  <Spinner className="mr-2" />
  Loading...
</Button>
```

### Screen reader utilities

```tsx
// Visually hidden but accessible
<span className="sr-only">Close menu</span>

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## Animation conventions

```tsx
// Subtle transitions (default)
<div className="transition-colors" />
<div className="transition-opacity" />

// Interactive feedback
<button className="transition-colors hover:bg-accent" />

// Entrance animations
<div className="animate-in fade-in duration-200" />
<div className="animate-in slide-in-from-bottom-4" />

// Duration scale
duration-150  // Fast (micro-interactions)
duration-200  // Default
duration-300  // Medium (modals, drawers)
duration-500  // Slow (page transitions)
```

## Responsive design

```tsx
// Mobile-first breakpoints
<div className="
  px-4              // Mobile
  sm:px-6           // ≥640px
  md:px-8           // ≥768px
  lg:px-12          // ≥1024px
  xl:px-16          // ≥1280px
">

// Common responsive patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
<div className="flex flex-col md:flex-row" />
<div className="hidden md:block" />
<div className="text-sm md:text-base" />
```

## Dark mode

```tsx
// Automatic with CSS variables (preferred)
<div className="bg-background text-foreground" />

// Manual overrides when needed
<div className="bg-white dark:bg-gray-900" />

// Images
<img className="dark:invert" />
<img className="dark:brightness-90" />
```

## cn() utility usage

Always use `cn()` for conditional classes:

```tsx
import { cn } from '@/lib/utils';

function Component({ className, variant }) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg border p-4',
        // Variant styles
        variant === 'destructive' && 'border-destructive bg-destructive/10',
        // External className (always last)
        className,
      )}
    />
  );
}
```

## Checklist for new components

- [ ] Uses existing design tokens (colors, spacing)
- [ ] Follows established component patterns
- [ ] Supports dark mode via CSS variables
- [ ] Has proper focus states
- [ ] Uses `cn()` for className composition
- [ ] Responsive on all breakpoints
- [ ] Accessible (labels, ARIA, contrast)
