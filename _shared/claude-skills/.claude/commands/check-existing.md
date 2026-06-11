---
name: check-existing
description: Audit existing components, styles, packages, and utilities in the codebase
---

Run a quick audit of what's already available in this codebase.

## Check these areas:

1. **Components** - List all components in `src/components/` and `src/components/ui/`

2. **Styles** - Review `tailwind.config.js`/`tailwind.config.ts` for custom tokens, and `globals.css` for custom styles

3. **Packages** - Review `package.json` dependencies for available libraries

4. **Utilities** - List helpers in `src/lib/`, `src/utils/`, and hooks in `src/hooks/`

## Output a summary:

- Available UI components
- Custom Tailwind tokens (colors, spacing, animations)
- Key packages installed (UI libraries, utilities, etc.)
- Available custom hooks and utilities

This helps understand what's reusable before implementing new features.
