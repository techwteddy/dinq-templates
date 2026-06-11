---
description: Format code with Prettier
allowed-tools: Bash(npx:*), Bash(pnpm:*), Bash(npm:*)
argument-hint: [check]
---

# Format Command

Format code using Prettier:

## Usage

- `/format` - Format all files
- `/format check` - Check formatting without making changes

## Commands

Based on argument `$1`:

- empty: `pnpm format` or `npx prettier --write .`
- `check`: `pnpm format:check` or `npx prettier --check .`

After formatting, report how many files were modified (if any).

To organize imports as well (if configured):

```bash
pnpm organize-imports
# or
npx organize-imports-cli
```
