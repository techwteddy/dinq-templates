---
description: Generate Prisma client from schema
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*)
---

# Database Generate Command

Generate the Prisma client from the database schema:

```bash
npx prisma generate
# or if configured in package.json
pnpm db:generate
npm run db:generate
```

This regenerates the Prisma client based on `prisma/schema.prisma`.

After running, inform the user that:

1. The Prisma client has been regenerated
2. TypeScript types are now updated
3. They may need to restart their dev server to pick up the changes

If there are schema errors, read and report them clearly.
