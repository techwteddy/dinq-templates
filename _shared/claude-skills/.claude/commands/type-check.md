---
description: Run TypeScript type checking across all packages
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*), Read
---

# Type Check Command

Run TypeScript type checking without emitting files:

## All packages

```bash
pnpm type-check
# or
npm run type-check
# or
npx tsc --noEmit
```

## Individual packages (monorepo)

```bash
pnpm --filter frontend type-check
pnpm --filter backend type-check
```

If type errors are found:

1. List all errors grouped by file
2. Provide the file path and line number for each error
3. Explain the type mismatch clearly
4. Suggest fixes where possible

Adjust filter names based on the project's actual package names.
