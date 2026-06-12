# /new-component

Scaffolds a new section component following the project's conventions.

## Usage

```
/new-component <ComponentName>
```

Example: `/new-component Testimonials`

## Steps to execute

1. **Create `src/components/<ComponentName>.tsx`** with:
   - `"use client"` directive at the top
   - A section element with `id="<componentname>"` (lowercase)
   - The glassmorphism card pattern for any card-like UI:
     ```ts
     style={{
       backgroundColor: "rgba(255, 255, 255, 0.1)",
       backdropFilter: "blur(12px)",
       border: "1px solid rgba(255, 255, 255, 0.2)",
     }}
     ```
   - Section heading with gradient text:
     ```tsx
     <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
       <ComponentName>
     </h2>
     ```
   - TypeScript interface for the component's data shape (if applicable)
   - Data array defined at the top of the file (not fetched from API)

2. **Create `src/__tests__/<ComponentName>.test.tsx`** with:
   - `renders the section heading` test
   - `renders key content` test (at least one item from the data)
   - Interaction tests (modals, toggles, clicks) if applicable
   - All tests must pass before committing

3. **Add to `src/app/page.tsx`**:
   - Import the component
   - Place it in the correct position in the page sequence

4. **Add to `src/components/Navbar.tsx`** `links` array if it is a full-page section:
   ```ts
   { name: "<ComponentName>", href: "#<componentname>" }
   ```

5. **Update documentation**:
   - Add entry to `docs/COMPONENTS.md`
   - Add feature bullet to `README.md`
   - Add entry to `CHANGELOG.md` under `Unreleased`

6. **Run and verify**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```
   All must pass before opening a PR.

## Do not

- Fetch data from an API — all data is static arrays in the component file
- Skip the test file — every component requires tests
- Use a different card style — always use the glassmorphism pattern
- Use CSS Modules or styled-components — Tailwind only
