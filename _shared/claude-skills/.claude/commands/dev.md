---
description: Start development servers for the monorepo
allowed-tools: Bash(pnpm:*), Bash(npm:*)
argument-hint: [service]
---

# Development Server Command

Start development servers based on the argument provided:

## Usage

- `/dev` or `/dev all` - Start all services
- `/dev frontend` - Start frontend only (typically port 3000)
- `/dev backend` - Start backend only (typically port 3001)

## Commands

Based on argument `$1`:

- `all` or empty: `pnpm dev` or `npm run dev`
- `frontend`: `pnpm --filter frontend dev` or equivalent
- `backend`: `pnpm --filter backend dev` or equivalent

Run the appropriate command and inform the user which ports are being used.

Adjust the filter names and port numbers based on the project's actual configuration.
