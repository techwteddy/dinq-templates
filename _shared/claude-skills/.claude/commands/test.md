---
description: Run tests for frontend (Vitest) or backend (Jest)
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*), Read, Grep, Glob
argument-hint: [frontend|backend|all]
---

# Test Command

Run tests based on the argument provided:

## Usage

- `/test` or `/test all` - Run all tests
- `/test frontend` - Run frontend tests with Vitest
- `/test backend` - Run backend tests with Jest

## Commands

Based on argument `$1`:

- `frontend`: `pnpm --filter frontend test` or `npx vitest`
- `backend`: `pnpm --filter backend test` or `npx jest`
- `all` or empty: Run both frontend and backend tests

## Options

- For frontend with UI: `npx vitest --ui`
- For frontend coverage: `npx vitest --coverage`
- For backend coverage: `npx jest --coverage`

If tests fail:

1. Read the test output carefully
2. Identify failing test files and specific test cases
3. Report the failures with file paths and error messages
4. Suggest fixes if the issue is clear

Adjust filter names based on the project's actual package names.
