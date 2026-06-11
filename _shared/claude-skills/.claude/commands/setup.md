---
description: Set up the development environment from scratch
allowed-tools: Bash(pnpm:*), Bash(npm:*), Bash(cp:*), Read
---

# Setup Command

Initialize the development environment for a new developer:

```bash
pnpm setup
# or
npm run setup
```

This command typically:

1. Copies `.env.example` to `.env` files
2. Installs all dependencies
3. Generates Prisma client
4. Builds all packages

## Manual Steps (if setup script doesn't exist)

1. Copy environment files:

```bash
cp .env.example .env
# For monorepos, also copy app-specific env files
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Build all packages:

```bash
pnpm build
# or
npm run build
```

## Prerequisites

- Node.js 20.x or later
- pnpm 9.x+ (or npm/yarn)
- Docker (if using containerized services like Postgres, Redis, etc.)
