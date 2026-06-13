# Contributing to Next.js Multi-Branch Boilerplate

Thank you for your interest in contributing! We welcome contributions from the community, whether it's bug fixes, new features, documentation improvements, or reporting issues.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project follows a simple code of conduct: **Be respectful and constructive**. We're all here to build something great together.

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### 1. Reporting Bugs

Before creating a bug report, please:

- Check existing [GitHub Issues](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues) to avoid duplicates
- Gather information about the bug (error messages, screenshots, steps to reproduce)

**When creating a bug report, include:**

- **Clear title** - Describe the issue in one sentence
- **Steps to reproduce** - Numbered list of exact steps
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Environment** - OS, Node.js version, browser (if applicable)
- **Screenshots** - If applicable
- **Additional context** - Any other relevant information

### 2. Suggesting Features

We love feature suggestions! Before submitting:

- Check [existing discussions](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/discussions) and issues
- Consider if the feature fits the project's scope and goals

**When suggesting a feature, include:**

- **Clear title** - Describe the feature in one sentence
- **Problem statement** - What problem does this solve?
- **Proposed solution** - How would this feature work?
- **Alternatives** - Other solutions you've considered
- **Use cases** - Real-world scenarios where this helps
- **Screenshots/mockups** - If applicable

### 3. Contributing Code

We welcome code contributions! Here's how:

1. **Fork the repository**
2. **Clone your fork locally**
3. **Create a feature branch**
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a Pull Request**

See [Development Setup](#development-setup) and [Pull Request Process](#pull-request-process) for details.

## Development Setup

### Prerequisites

- Node.js 18+ (20 recommended)
- pnpm (recommended) or npm
- PostgreSQL or Supabase account
- Git

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/nextjs-multi-branch-boilerplate.git
cd nextjs-multi-branch-boilerplate

# 2. Add upstream remote
git remote add upstream https://github.com/aguswirajati/nextjs-multi-branch-boilerplate.git

# 3. Install dependencies
pnpm install

# 4. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 5. Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 6. Run development server
pnpm dev
```

### Development Workflow

```bash
# Create a new branch for your feature
git checkout -b feature/my-amazing-feature

# Make your changes...

# Run tests
pnpm test
pnpm run test:unit

# Format code
pnpm format

# Lint code
pnpm lint

# Build to verify
pnpm build

# Commit your changes
git add .
git commit -m "feat: add my amazing feature"

# Push to your fork
git push origin feature/my-amazing-feature

# Open a Pull Request on GitHub
```

## Coding Standards

### TypeScript

- Use **TypeScript** with strict mode enabled
- Prefer **types** over **interfaces** for simple structures
- Use **interfaces** for objects that will be extended
- Always define return types for functions
- Avoid `any` - use `unknown` if type is truly unknown

**Good:**

```typescript
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface CreateUserInput {
  email: string
  password: string
  fullName: string
}

export async function createUser(data: CreateUserInput): Promise<User> {
  // Implementation
}
```

**Bad:**

```typescript
export function createUser(data: any) {
  // ❌ No types, no return type
  // Implementation
}
```

### File Organization

- **Features** - Use feature-based folder structure (`features/users/`, `features/branches/`)
- **Components** - Small, focused components with single responsibility
- **Server Actions** - Place in `features/[feature]/actions/`
- **Services** - Business logic in `features/[feature]/services/`
- **Types** - Define in `features/[feature]/types/`

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `user-service.ts`, `create-user-form.tsx`)
- **Components**: `PascalCase` (e.g., `UserTable`, `BranchForm`)
- **Functions**: `camelCase` (e.g., `getUserById`, `createUser`)
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `CreateUserInput`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)

### Code Style

We use **Prettier** for formatting and **ESLint** for linting:

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check

# Run linter
pnpm lint
```

**General rules:**

- **Indentation**: 2 spaces (enforced by Prettier)
- **Quotes**: Single quotes (enforced by Prettier)
- **Semicolons**: Yes (enforced by Prettier)
- **Max line length**: 100 characters (guideline, not enforced)
- **Trailing commas**: Yes (enforced by Prettier)

### React Best Practices

- Prefer **Server Components** (default in Next.js 16)
- Use **'use client'** only when needed (interactivity, hooks, browser APIs)
- Extract complex logic into custom hooks
- Use **Server Actions** for mutations
- Avoid prop drilling - use context or composition

**Server Component (default):**

```typescript
// app/(dashboard)/users/page.tsx
export default async function UsersPage() {
  const users = await getUsers()  // Direct database call
  return <UserTable users={users} />
}
```

**Client Component (when needed):**

```typescript
'use client' // Only when using hooks, events, browser APIs

import { useState } from 'react'

export function UserForm() {
  const [email, setEmail] = useState('')
  // Component with interactivity
}
```

### Database & Prisma

- Use **soft delete** pattern (set `deletedAt`, don't hard delete)
- Always include **audit fields** (createdBy, createdAt, updatedBy, updatedAt)
- Use **Prisma helpers** from `lib/utils/prisma-helpers.ts`
- Validate input with **Zod schemas** before database operations

**Example:**

```typescript
import { withoutDeleted, softDelete, createAuditData } from '@/lib/utils/prisma-helpers'

// Query without deleted records
const users = await prisma.user.findMany({
  where: withoutDeleted({ status: 'ACTIVE' }),
})

// Soft delete
await softDelete(prisma.user, userId, currentProfileId)

// Create with audit data
await prisma.user.create({
  data: {
    email: 'user@example.com',
    ...createAuditData(currentProfileId),
  },
})
```

### Testing

- Write **E2E tests** for critical user flows (Playwright)
- Write **unit tests** for utilities and complex logic (Vitest)
- Aim for **meaningful tests**, not just coverage numbers
- Test both success and error cases

**E2E Test Example:**

```typescript
test('should create a new user', async ({ page }) => {
  await page.goto('/admin/users')
  await page.click('text=Add User')
  await page.fill('input[name="email"]', 'test@example.com')
  // ... fill other fields
  await page.click('button[type="submit"]')
  await expect(page.locator('text=User created successfully')).toBeVisible()
})
```

**Unit Test Example:**

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils/cn'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })
})
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, semantic commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, configs, etc.)
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

**Simple commit:**

```bash
git commit -m "feat: add user export to CSV"
```

**With scope:**

```bash
git commit -m "fix(auth): resolve login redirect loop"
```

**With body and footer:**

```bash
git commit -m "feat(users): add bulk user import

- Parse CSV files
- Validate email format
- Check for duplicates
- Send welcome emails

Closes #123"
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer:

```bash
git commit -m "feat(api): redesign user API

BREAKING CHANGE: User API now requires authentication token in all requests"
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream** to avoid conflicts:

   ```bash
   git fetch upstream
   git rebase upstream/development
   ```

2. **Run all checks**:

   ```bash
   pnpm format        # Format code
   pnpm lint          # Lint code
   pnpm test          # Run E2E tests
   pnpm run test:unit # Run unit tests
   pnpm build         # Verify build succeeds
   ```

3. **Update documentation** if needed

4. **Write descriptive commits** using [Conventional Commits](#commit-convention)

### Submitting a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/my-amazing-feature
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** completely:
   - **Title**: Clear, descriptive title (e.g., "feat: add CSV export for users")
   - **Description**: What does this PR do? Why is it needed?
   - **Related issues**: Link to any related issues (e.g., "Closes #123")
   - **Testing**: How did you test this?
   - **Screenshots**: If UI changes, include before/after screenshots

4. **Request review** from maintainers

### PR Template

```markdown
## Description

<!-- Describe what this PR does -->

## Motivation

<!-- Why is this change needed? What problem does it solve? -->

## Related Issues

<!-- Link to any related issues (e.g., Closes #123) -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

<!-- How did you test this? -->

- [ ] E2E tests added/updated
- [ ] Unit tests added/updated
- [ ] Manually tested

## Checklist

- [ ] My code follows the code style of this project
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests pass
- [ ] My commits follow the Conventional Commits format
```

### Review Process

- Maintainers will review your PR within 1-3 business days
- Address any requested changes by pushing new commits to your branch
- Once approved, a maintainer will merge your PR
- Your contribution will be credited in the changelog

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/discussions)
- **Bugs**: Open an [Issue](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues)
- **Chat**: Comment on existing issues or PRs

## Recognition

All contributors will be:

- Listed in the project's contributors
- Mentioned in release notes (for significant contributions)
- Forever appreciated by the community!

---

**Thank you for contributing to Next.js Multi-Branch Boilerplate!** 🎉

Your contributions help make this project better for everyone. We appreciate your time and effort!
