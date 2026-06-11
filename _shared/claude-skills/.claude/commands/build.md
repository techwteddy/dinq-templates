---
description: Build all packages in the monorepo using Turbo
allowed-tools: Bash(npm:*), Bash(pnpm:*), Read
---

# Build Command

Build all packages in the monorepo:

```bash
pnpm build
# or
npm run build
```

If the build fails:

1. Read the error output carefully
2. Identify which package failed
3. Check for TypeScript errors, missing dependencies, or configuration issues
4. Report the specific errors to the user with file paths and line numbers

If the user provides an argument like "frontend" or "backend", build only that package:

```bash
# Examples for monorepo setups
pnpm --filter frontend build
pnpm --filter backend build
pnpm --filter @myorg/frontend build
```

Adjust the filter names based on the project's actual package names.
