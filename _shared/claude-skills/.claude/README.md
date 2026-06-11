# Claude Skills

This folder contains Claude-specific skills, instructions, and configurations for Solana fullstack web app development.

## Purpose

Use this folder to store:

- Custom instructions for Claude
- Project-specific knowledge and patterns
- Reusable code snippets and templates
- Development guidelines and best practices

## Workflow Reminders

### Before Writing Code

**Always check for existing code first:**

- Components in `src/components/` and `src/components/ui/`
- Styles in `tailwind.config` and `globals.css`
- Packages in `package.json`
- Utilities in `src/lib/`, `src/utils/`, `src/hooks/`

Run `/check-existing` to audit what's available.

### After Coding Sessions

**Always run the code-simplifier agent:**

- At the end of long coding sessions
- Before creating or merging PRs
- When cleaning up complex code

Invoke with: `/simplify` or ask Claude to "use the code simplifier agent"
