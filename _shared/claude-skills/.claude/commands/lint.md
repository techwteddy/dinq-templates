---
description: Run ESLint across all packages
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*), Read
---

# Lint Command

Run ESLint across all packages:

```bash
pnpm lint
# or
npm run lint
# or
npx eslint .
```

If linting fails:

1. Parse the ESLint output for errors and warnings
2. Group issues by file
3. Report the most critical errors first
4. Offer to fix auto-fixable issues with `pnpm lint --fix` (ask user first)

For specific packages in a monorepo:

```bash
pnpm --filter frontend lint
pnpm --filter backend lint
```

Adjust filter names based on the project's actual package names.
