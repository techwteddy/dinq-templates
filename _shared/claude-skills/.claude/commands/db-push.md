---
description: Push Prisma schema to database (use with caution)
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*)
---

# Database Push Command

Push the Prisma schema to the database:

```bash
npx prisma db push
# or if configured in package.json
pnpm db:push
npm run db:push
```

**WARNING**: This command modifies the database schema. It should be used carefully:

- In development: Safe to use for quick iterations
- In production: Use migrations instead

Before running, ask the user to confirm they want to push schema changes.

Related commands:

- `npx prisma db pull` - Pull schema from existing database
- `npx prisma studio` - Open Prisma Studio to inspect data
- `npx prisma migrate dev` - Create and apply migrations (safer for production)
