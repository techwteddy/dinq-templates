---
description: Review a pull request on GitHub
allowed-tools: Bash(gh:*), Bash(git:*), Read, Grep, Glob
argument-hint: [pr-number]
---

# Review PR Command

Review a GitHub pull request thoroughly.

## Process

1. Get PR information:

```bash
gh pr view $1 --json title,body,files,additions,deletions,baseRefName,headRefName
```

2. Get the diff:

```bash
gh pr diff $1
```

3. Check out the PR locally if needed:

```bash
gh pr checkout $1
```

## Review Checklist

For each file changed, check:

- [ ] Code correctness and logic
- [ ] TypeScript types are properly used (no `any`)
- [ ] Error handling is appropriate
- [ ] No security vulnerabilities (XSS, injection, etc.)
- [ ] Code follows project patterns and conventions
- [ ] Tests are added/updated for new functionality
- [ ] No console.logs or debug code left behind
- [ ] API changes are reflected in OpenAPI spec (if applicable)

## Output Format

Provide a structured review:

1. **Summary**: Overall assessment
2. **Positives**: What's done well
3. **Issues**: Problems that need fixing (with file:line references)
4. **Suggestions**: Optional improvements
5. **Verdict**: Approve / Request Changes / Comment
