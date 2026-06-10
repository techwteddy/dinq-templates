# Build Quality Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-enable TypeScript type checking and ESLint during builds, add Next.js standalone output for Cloud Run optimization, and harden `cloudbuild.yaml` with pre-deploy validation and proper resource limits.

**Architecture:** Four targeted changes across two files (`next.config.mjs`, `cloudbuild.yaml`). One TypeScript error must be fixed in `ZoomableImage.tsx` before the ignore flags can be removed. ESLint has a broken transitive dependency (`tsconfig-paths`) that requires a clean install. No new abstractions introduced.

**Tech Stack:** Next.js 14, TypeScript 5, ESLint 8, Google Cloud Build, Cloud Run

---

## Files Modified

| File | Change |
|---|---|
| `next.config.mjs` | Remove `ignoreBuildErrors`/`ignoreDuringBuilds`; add `output: "standalone"` |
| `src/components/ZoomableImage.tsx` | Fix `props.className` → `className` (line 100) |
| `cloudbuild.yaml` | Add lint + type-check steps; add `--memory`, `--cpu`, `--max-instances` flags |

---

## Task 1: Fix the TypeScript Error in ZoomableImage

**Context:** The component signature destructures `className` from `ImageProps` at the top level: `{ className, alt, ...props }`. Then `props` is further destructured into `{ width, height, ...restProps }`. At line 100, `props.className` is referenced — but `className` was already pulled out of `props` in the function params, so TypeScript correctly reports it doesn't exist on the remaining `props` object. The fix is to use the already-destructured `className` variable.

**Files:**
- Modify: `src/components/ZoomableImage.tsx:100`

- [ ] **Step 1: Read the current line to confirm context**

Confirm line 100 reads:
```tsx
className={cn("transition-all duration-300 group-hover:brightness-95", props.className)}
```

- [ ] **Step 2: Apply the fix**

Change line 100 from:
```tsx
className={cn("transition-all duration-300 group-hover:brightness-95", props.className)}
```
to:
```tsx
className={cn("transition-all duration-300 group-hover:brightness-95", className)}
```

The full `<Image>` block at lines 95–101 should now read:
```tsx
<Image 
  alt={alt} 
  width={width}
  height={height}
  {...restProps}
  className={cn("transition-all duration-300 group-hover:brightness-95", className)}
/>
```

- [ ] **Step 3: Verify TypeScript passes with no errors**

Run from project root (`/home/sheamus/Repositories/famous-sheamus-website`):
```bash
npx tsc --noEmit
```
Expected: no output, exit code 0.

If errors remain, read the full output and fix each before continuing.

- [ ] **Step 4: Commit**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
git add src/components/ZoomableImage.tsx
git commit -m "fix: use destructured className in ZoomableImage inner Image"
```

---

## Task 2: Fix the Broken ESLint Dependency

**Context:** Running `next lint` fails with `Cannot find module 'tsconfig-paths/lib/tsconfig-loader'`. This is a missing transitive dependency of `eslint-config-next`. A clean `npm install` resolves it by allowing npm to reconcile the dependency tree.

**Files:**
- No source file changes; `package-lock.json` may update

- [ ] **Step 1: Attempt a clean install**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npm install
```
Expected: installs/updates packages, no errors.

- [ ] **Step 2: Verify ESLint now runs**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npx next lint 2>&1
```
Expected: either `✔ No ESLint warnings or errors` or a list of code warnings (not a plugin-load failure).

If the `tsconfig-paths` error persists after `npm install`, install it explicitly:
```bash
npm install --save-dev tsconfig-paths
npx next lint 2>&1
```

- [ ] **Step 3: Review any lint warnings that surface**

If `next lint` reports code warnings (not errors), note them. `next lint` in Next.js 14 exits with code 1 only for errors, not warnings. Warnings are acceptable to leave for now — they do not block the build.

If there are lint **errors** (exit code 1 with code issues), fix them before continuing. Common Next.js lint errors include:
- `@next/next/no-img-element` — replace `<img>` with `<Image>` from `next/image`
- `react-hooks/exhaustive-deps` — add missing hook dependencies

- [ ] **Step 4: Commit if package-lock.json changed**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
git add package-lock.json package.json
git commit -m "fix: resolve missing tsconfig-paths ESLint transitive dependency"
```
If nothing changed in package files, skip this commit.

---

## Task 3: Remove Ignore Flags and Add Standalone Output in next.config.mjs

**Context:** `next.config.mjs` currently has two flags that hide all TypeScript and ESLint errors at build time. Removing them makes the build enforce quality. We also add `output: "standalone"` here — Next.js then produces a minimal self-contained server in `.next/standalone/`, which Cloud Run buildpacks automatically detect and use, reducing the deployed image size by ~40% and cutting cold start time.

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Apply all three changes to next.config.mjs**

Replace the entire file with:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://asset-tidycal.b-cdn.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://asset-tidycal.b-cdn.net; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://asset-tidycal.b-cdn.net; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://tidycal.com; frame-src 'self' https://tidycal.com https://www.youtube-nocookie.com; frame-ancestors 'self'; upgrade-insecure-requests;",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}
```

- [ ] **Step 2: Run a full production build to confirm it passes cleanly**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npm run build 2>&1
```
Expected output ends with something like:
```
✓ Compiled successfully
✓ Linting and checking validity of types
Route (app)  ...
```
And `.next/standalone/` directory is created.

If the build fails with TypeScript errors: read each error, fix the file it references, and re-run `npm run build`. Do not re-add the ignore flags.

If the build fails with ESLint errors: fix the rule violations it reports.

- [ ] **Step 3: Verify the dev server still works**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Expected: `200`

Kill the dev server:
```bash
kill %1
```

- [ ] **Step 4: Commit**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
git add next.config.mjs
git commit -m "feat: enable TS/ESLint build enforcement and standalone output for Cloud Run"
```

---

## Task 4: Harden cloudbuild.yaml with Validation Steps and Resource Limits

**Context:** The current `cloudbuild.yaml` deploys directly with no pre-deploy checks and no resource constraints on the Cloud Run service. We add:
1. A lint + type-check step that runs before deployment (catches broken code before it ships)
2. `--memory=1Gi --cpu=1` — Cloud Run service resource allocation (prevents OOM on cold starts)
3. `--max-instances=50` — caps scaling to prevent runaway cost on unexpected traffic spikes
4. `--allow-unauthenticated` — explicit (it was implicit before; making it clear)

The type-check step uses `npx tsc --noEmit` rather than `npm run build` because the deploy step already runs a full build via buildpacks. Running it twice would double build time.

**Files:**
- Modify: `cloudbuild.yaml`

- [ ] **Step 1: Apply the updated cloudbuild.yaml**

Replace the entire file with:
```yaml
steps:
  # Step 1: Install dependencies
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['ci']

  # Step 2: Run ESLint — catches code quality issues before deploy
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['run', 'lint']

  # Step 3: Run TypeScript type check — catches type errors before deploy
  - name: 'node:20'
    entrypoint: 'npx'
    args: ['tsc', '--noEmit']

  # Step 4: Build and deploy to Cloud Run with resource constraints
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'famous-sheamus-website'
      - '--source'
      - '.'
      - '--region'
      - 'us-central1'
      - '--image'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/famous-sheamus-website:$COMMIT_SHA'
      - '--memory'
      - '1Gi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '50'
      - '--allow-unauthenticated'

# Satisfy the Service Account logging requirement
options:
  logging: CLOUD_LOGGING_ONLY
```

- [ ] **Step 2: Validate the YAML syntax**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
python3 -c "import yaml; yaml.safe_load(open('cloudbuild.yaml'))" && echo "YAML valid"
```
Expected: `YAML valid`

- [ ] **Step 3: Commit**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
git add cloudbuild.yaml
git commit -m "feat: add pre-deploy lint/typecheck and Cloud Run resource limits to cloudbuild"
```

---

## Task 5: End-to-End Smoke Test

**Context:** Verify the entire local build pipeline is clean before considering these changes ready to push.

- [ ] **Step 1: Run TypeScript check**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npx tsc --noEmit
```
Expected: no output, exit code 0.

- [ ] **Step 2: Run ESLint**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npm run lint
```
Expected: `✔ No ESLint warnings or errors` or only warnings (exit code 0).

- [ ] **Step 3: Run full production build**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
npm run build 2>&1
```
Expected: build completes successfully, `.next/standalone/` exists.

```bash
ls /home/sheamus/Repositories/famous-sheamus-website/.next/standalone/
```
Expected: `server.js` present in the listing.

- [ ] **Step 4: Confirm all 4 changes are committed**

```bash
cd /home/sheamus/Repositories/famous-sheamus-website
git log --oneline -5
```
Expected: 4 commits visible (ZoomableImage fix, ESLint dep fix, next.config.mjs changes, cloudbuild.yaml changes). Adjust if some tasks were combined.

---

## Self-Review

**Spec coverage:**
- ✓ Remove `ignoreBuildErrors` + `ignoreDuringBuilds` → Task 3
- ✓ Fix the 1 TypeScript error that surfaces → Task 1
- ✓ Fix broken ESLint dependency → Task 2
- ✓ Add `output: "standalone"` → Task 3
- ✓ Add `--memory=1Gi --cpu=1` → Task 4
- ✓ Add `--max-instances=50` → Task 4
- ✓ Add lint + build steps before deploy → Task 4
- ✓ Smoke test → Task 5

**No placeholders found.**

**Type consistency:** No new interfaces introduced; all changes are configuration/flag removals.
