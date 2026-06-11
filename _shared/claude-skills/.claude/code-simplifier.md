---
name: code-simplifier
description: Code simplification agent from the Claude Code team. Use this at the end of coding sessions or to clean up complex PRs. Reduces complexity, improves readability, and eliminates over-engineering.
user-invocable: true
always-apply: true
---

# Code Simplifier Agent

## What this Skill is for

Use the code-simplifier agent when:

- Finishing a long coding session
- Cleaning up complex PRs before review
- Refactoring overly complex code
- Reducing technical debt
- Improving code readability

## Installation

```bash
claude plugin install code-simplifier
```

Or from within a session:

```
/plugin marketplace update claude-plugins-official
/plugin install code-simplifier
```

## When to invoke

**IMPORTANT: Always consider running the code-simplifier agent:**

1. After completing a significant feature implementation
2. Before creating or merging a PR
3. When code feels overly complex or verbose
4. After multiple iterations on the same code
5. When reviewing code that has grown organically

## How to invoke

Ask Claude to "use the code simplifier agent" or "run code-simplifier on this code/PR/session"

## What it does

- Reduces unnecessary complexity
- Removes over-engineering
- Improves code readability
- Eliminates redundant abstractions
- Simplifies control flow
- Cleans up verbose patterns
