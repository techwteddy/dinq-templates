# /security-check

Runs a full security audit of the project. Execute this before every PR merge and after any dependency update.

## Usage

```
/security-check
```

## Steps to execute

### 1. Dependency audit
```bash
npm audit
```
- If vulnerabilities are found with `npm audit fix` available: run it and commit the result.
- If `--force` is required: evaluate the breaking changes manually before applying.
- Document any accepted vulnerabilities in this file under "Known accepted vulnerabilities".

### 2. Verify HTTP security headers
Open `next.config.ts` and confirm all headers are present and unmodified:

| Header | Expected value |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Must restrict `script-src`, `style-src`, `font-src`, `img-src`, `connect-src` |

If any header is missing or weakened: restore it and create a commit.

### 3. Review `remotePatterns` in `next.config.ts`
Confirm that only these hostnames are allowed:
- `github.com`
- `raw.githubusercontent.com`
- `cdn.jsdelivr.net`
- `static.cdnlogo.com`
- `placehold.co`
- `via.placeholder.com`

If a new hostname was added: verify it is a trusted, static CDN. If in doubt, remove it.

### 4. Check for secrets in source code
```bash
grep -rn "sk-" src/ --include="*.ts" --include="*.tsx"
grep -rn "PRIVATE" src/ --include="*.ts" --include="*.tsx"
grep -rn "password" src/ --include="*.ts" --include="*.tsx" -i
grep -rn "secret" src/ --include="*.ts" --include="*.tsx" -i
```
Any match must be reviewed. Credentials must never be committed — use `.env.local` (already in `.gitignore`).

### 5. Verify SVG sandbox
In `next.config.ts`, confirm:
```ts
dangerouslyAllowSVG: true,
contentSecurityPolicy: "default-src 'none'; img-src 'self' data:; script-src 'none'",
```
The `script-src 'none'` is the critical mitigation. Do not remove it.

### 6. Review external links
All `<a target="_blank">` links must have `rel="noopener noreferrer"`. Check:
```bash
grep -rn 'target="_blank"' src/ --include="*.tsx"
```
Every match must have the `rel` attribute.

### 7. Run full test suite
```bash
npm test
npm run build
```
Both must pass. A failing test or build is a blocker.

## Reporting

After running the check, summarize findings:
- ✅ No issues found
- ⚠️ Issues found and fixed (list them)
- ❌ Issues found, could not fix automatically (describe and ask user)

---

## Known accepted vulnerabilities

_None at this time._
