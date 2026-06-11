---
description: Generate OpenAPI spec and type-safe API client
allowed-tools: Bash(npm:*), Bash(pnpm:*), Bash(npx:*)
---

# API Generate Command

This command regenerates the type-safe API client from the backend OpenAPI spec.

## Steps

1. First, generate the OpenAPI spec from the backend (if applicable):

```bash
# Adjust the command based on your project structure
pnpm run generate:openapi
# or
npm run generate:openapi
```

2. Then, generate the API client (React Query hooks) from the spec:

```bash
npx orval
# or if configured in package.json
pnpm run generate:api
```

## What gets generated

- OpenAPI 3.0 specification from Zod schemas (or other schema source)
- Type-safe React Query hooks in your configured output directory
- Request/response types that match the backend exactly

After running, inform the user that:

1. The API client has been regenerated
2. New hooks are available for any new endpoints
3. TypeScript will now catch API contract mismatches
