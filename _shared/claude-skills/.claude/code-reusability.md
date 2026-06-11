---
name: code-reusability
description: Always check for existing styles, packages, and reusable components before writing new code. Prevents duplication and ensures consistency across the codebase.
user-invocable: true
always-apply: true
---

# Code Reusability Skill

## ALWAYS DO THIS BEFORE WRITING CODE

Before implementing any feature, styling, or functionality, you MUST:

### 1. Check Existing Components

```bash
# Search for similar components
ls src/components/
ls src/components/ui/
```

Look for:

- Components that already do what's needed
- Components that can be extended or composed
- Patterns already established in the codebase

**Ask yourself:**

- Does a similar component already exist?
- Can I extend an existing component instead of creating new one?
- Is there a shared component in `components/ui/` I should use?

### 2. Check Existing Styles

```bash
# Check Tailwind config for custom classes
cat tailwind.config.js
cat tailwind.config.ts

# Check for global styles
cat src/styles/globals.css
cat src/app/globals.css

# Check for existing utility classes
grep -r "className=" src/components/ | head -50
```

Look for:

- Custom color tokens already defined
- Existing spacing/sizing patterns
- Animation classes already created
- Theme variables (CSS custom properties)

**Before adding new Tailwind classes:**

- Check if the color exists in the theme
- Check if similar styling patterns are used elsewhere
- Use existing design tokens over arbitrary values

### 3. Check Existing Packages

```bash
# Check what's already installed
cat package.json
```

Look for:

- Packages that already solve the problem
- Similar packages that might conflict
- Utility libraries already available (lodash, date-fns, etc.)

**Before adding a new package:**

- Is there an existing package that does this?
- Does the existing package have the feature needed?
- Would adding this duplicate functionality?

### 4. Check Existing Utilities/Hooks

```bash
# Search for existing utilities
ls src/lib/
ls src/utils/
ls src/hooks/

# Search for specific patterns
grep -r "export function" src/lib/
grep -r "export const use" src/hooks/
```

Look for:

- Helper functions already written
- Custom hooks that handle similar logic
- Shared utilities for common operations

## Checklist Before Every Implementation

- [ ] Searched `components/` for similar components
- [ ] Searched `components/ui/` for base components
- [ ] Checked `tailwind.config` for existing design tokens
- [ ] Checked `globals.css` for existing styles
- [ ] Checked `package.json` for existing packages
- [ ] Checked `lib/` and `utils/` for helper functions
- [ ] Checked `hooks/` for existing custom hooks

## When Creating New Code

If nothing exists, still:

1. **Follow existing patterns** - Match the style of similar code in the repo
2. **Make it reusable** - Design for reuse from the start
3. **Use existing tokens** - Prefer theme colors/spacing over arbitrary values
4. **Document for discovery** - Use clear naming so others find it

## Common Reusable Patterns to Look For

### UI Components

- Button, Input, Select, Modal, Dialog
- Card, Badge, Avatar, Tooltip
- Loading spinners, Skeletons
- Toast/Notification components

### Layout Components

- Container, Grid, Stack, Flex wrappers
- Page layouts, Sidebars, Headers

### Utility Hooks

- useDebounce, useThrottle
- useLocalStorage, useSessionStorage
- useMediaQuery, useBreakpoint
- useCopyToClipboard
- useClickOutside

### Utility Functions

- cn() for className merging
- formatDate, formatCurrency
- API helpers, fetch wrappers
- Validation helpers

## Example Workflow

**User asks:** "Add a button to submit the form"

**Before writing:**

1. Check `src/components/ui/button.tsx` - Button exists!
2. Check how other forms use buttons
3. Use existing Button component with appropriate variant

**User asks:** "Add date formatting to the card"

**Before writing:**

1. Check `package.json` - date-fns already installed!
2. Check `src/lib/` - formatDate utility exists!
3. Use existing utility, don't write new formatter
