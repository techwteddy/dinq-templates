# Code Style Guide

This document outlines the code formatting standards and conventions for this project.

## <� Automated Formatting

This project uses **Prettier** for automated code formatting and **ESLint** for code quality.

### Quick Commands

```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check

# Run ESLint
npm run lint
```

### Pre-commit Hook

**Husky** automatically runs **lint-staged** before each commit:

- Formats all staged TypeScript/JavaScript files with Prettier
- Formats all staged JSON, Markdown, and CSS files with Prettier
- Ensures consistent code style across the codebase

## =� Prettier Configuration

Located in `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Key Rules

- **No semicolons** - Cleaner code style
- **Single quotes** - For string literals
- **2 spaces** - Tab width for indentation
- **Trailing commas** - ES5 compatible
- **100 characters** - Maximum line width
- **Arrow parens** - Avoid when possible (x => x instead of (x) => x)
- **LF line endings** - Unix-style
- **Tailwind class sorting** - Automatic class ordering via plugin

## =

ESLint Configuration

Located in `eslint.config.mjs`:

Uses Next.js recommended configurations:

- eslint-config-next/core-web-vitals
- eslint-config-next/typescript

### Ignored Paths

- `.next/` - Build output
- `out/` - Export output
- `build/` - Production build
- `next-env.d.ts` - Generated types

## =� Files Excluded from Formatting

See `.prettierignore` for complete list. Key exclusions:

- `node_modules/` - Dependencies
- `.next/`, `out/`, `dist/`, `build/` - Build outputs
- `lib/generated/` - Generated code (Prisma client)
- `prisma/migrations/` - Database migrations
- `package-lock.json`, `pnpm-lock.yaml` - Lock files
- `.env*` - Environment files

## <� TypeScript Conventions

### Naming Conventions

```typescript
//  DO: Use PascalCase for types, interfaces, and components
type UserProfile = { id: string; name: string }
interface BranchData {
  code: string
  type: BranchType
}
function UserCard({ user }: { user: UserProfile }) {}

//  DO: Use camelCase for variables, functions, and properties
const userName = 'John'
const getUserById = (id: string) => {}

//  DO: Use UPPER_SNAKE_CASE for constants
const MAX_BRANCH_DEPTH = 5
```

### File Naming

- **kebab-case** for file names: `user-profile.tsx`, `auth-utils.ts`
- **PascalCase** for component files (optional): `UserProfile.tsx`

### Import Organization

1. External packages (React, Next.js, etc.)
2. Internal absolute imports (@/)
3. Relative imports
4. Styles

### Type Annotations

```typescript
//  DO: Use explicit return types for functions
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

//  DO: Use type inference for simple variables
const userName = 'John' // string inferred

//  DO: Define types for complex objects
type CreateUserInput = {
  email: string
  fullName: string
  branchId: string
}
```

## <� React / Next.js Conventions

### Component Structure

```typescript
'use client' // If needed

import { useState } from 'react'

interface ComponentProps {
  userId: string
  onDelete?: () => void
}

export function Component({ userId, onDelete }: ComponentProps) {
  const [state, setState] = useState(false)

  return <div>{/* JSX */}</div>
}
```

### Server vs Client Components

- Default to Server Components (no 'use client')
- Use 'use client' only when needed (state, effects, event handlers)

## <� Tailwind CSS Conventions

### Class Ordering

Classes are automatically sorted by `prettier-plugin-tailwindcss`:

```tsx
// Auto-sorted (layout � spacing � colors � typography � effects)
<div className="bg-primary flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium" />
```

### Using CSS Variables

```tsx
//  DO: Use theme CSS variables
<div className="bg-background text-foreground border-border" />

// L DON'T: Use hard-coded colors
<div className="bg-white text-black border-gray-300" />
```

## =� Comments & Documentation

### Function Documentation

```typescript
/**
 * Get all branches with optional filtering
 *
 * @param filters - Optional filters for branch queries
 * @returns Promise resolving to array of branch list items
 */
export async function getBranches(filters?: BranchFilters) {
  // implementation
}
```

### Inline Comments

- Add comments for complex logic
- Avoid stating the obvious

## =� Best Practices

### Server Actions

```typescript
//  DO: Use Zod for input validation
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
})

export async function createUser(data: z.infer<typeof createUserSchema>) {
  const validated = createUserSchema.parse(data)
  // create user
}
```

### Error Handling

```typescript
//  DO: Use try-catch with specific error types
try {
  const result = await riskyOperation()
  return { success: true, data: result }
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: 'Validation failed' }
  }
  console.error('Unexpected error:', error)
  throw error
}
```

### Soft Delete Pattern

```typescript
//  DO: Always filter soft-deleted records
const users = await prisma.user.findMany({
  where: withoutDeleted({ isActive: true }),
})

//  DO: Use soft delete helper
await softDelete(prisma.user, userId, currentUser.profile.id)

// L DON'T: Hard delete
await prisma.user.delete({ where: { id: userId } })
```

## =� Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Next.js Style Guide](https://nextjs.org/docs/app/building-your-application/styling)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

---

**Last Updated:** 2025-11-25
**Maintained By:** Development Team
