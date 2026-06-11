# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
responsibly by emailing **28890310+yuchmanp@users.noreply.github.com** instead of opening a public issue.

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Any potential impact

I'll respond within 48 hours and work with you on a fix before any public disclosure.

## Scope

This is a family home management app. The main security concerns are:
- Unauthorized access to family data (calendar, chores, messages)
- Credential leaks (Supabase keys, Gmail passwords, VAPID keys)
- XSS or injection in user-facing inputs

## Best Practices for Deployers

- Never commit `.env` files — use `.env.example` as a template
- Use strong, unique values for `CRON_SECRET` (e.g., `openssl rand -hex 32`)
- Rotate Gmail app passwords periodically
- Keep the `allowed_emails` table tight — only add family members
- Review Supabase RLS policies if you modify the schema
