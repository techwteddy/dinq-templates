---
description: Clean build artifacts and caches
allowed-tools: Bash(rm:*), Bash(pnpm:*), Bash(npm:*)
---

# Clean Command

Clean build artifacts and caches across the monorepo:

```bash
# If there's a clean script
pnpm clean
# or
npm run clean
```

This removes:

- `.turbo` cache directories
- `node_modules/.cache`
- Build output directories
- Generated files that can be regenerated

For a more thorough clean:

```bash
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build
rm -rf apps/*/.next
rm -rf apps/*/dist
rm -rf packages/*/dist
```

After cleaning, the user may need to:

1. Run `pnpm install` or `npm install` to reinstall dependencies
2. Run `pnpm db:generate` or equivalent to regenerate Prisma client
3. Run `pnpm build` or `npm run build` to rebuild packages
