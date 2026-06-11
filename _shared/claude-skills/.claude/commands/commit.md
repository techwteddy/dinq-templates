---
description: Create a git commit with a well-formatted message
allowed-tools: Bash(git:*), Read, Grep, Glob
argument-hint: [message]
---

# Commit Command

Create a git commit following the project's conventions.

## Process

1. Run `git status` to see what files have changed
2. Run `git diff --staged` and `git diff` to understand the changes
3. Check recent commits with `git log --oneline -5` for message style

4. If no argument provided, analyze the changes and suggest a commit message
5. If argument `$ARGUMENTS` provided, use it as the commit message

## Commit Message Format

- Use conventional commit style: `type: description`
- Types: feat, fix, refactor, style, docs, test, chore
- Keep the first line under 72 characters
- Focus on the "why" not the "what"

## Execution

```bash
git add -A
git commit -m "$(cat <<'EOF'
<commit message>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Do NOT push unless explicitly asked.
