# /add-project

Adds a new project entry to the ProjectsGrid component.

## Usage

```
/add-project
```

Claude will ask for the required information, then make the changes.

## Information required

| Field | Type | Notes |
|---|---|---|
| `title` | string | Project display name |
| `image` | string | Absolute URL to a screenshot (prefer `raw.githubusercontent.com`) |
| `description` | string | 1–2 sentence description of the project |
| `github` | string | Full GitHub repo URL |
| `live` | string | Live demo URL, or `""` if not deployed |
| `tags` | string[] | Technologies used — must match existing tags when possible (React, Next.js, TypeScript, Node.js, Vite, etc.) |

## Steps to execute

1. **Open `src/components/ProjectsGrid.tsx`**
2. **Append a new entry** to the `projects` array at the top of the file:
   ```ts
   {
     title: "<title>",
     image: "<image URL>",
     description: "<description>",
     github: "<github URL>",
     live: "<live URL or empty string>",
     tags: ["<tag1>", "<tag2>"],
   },
   ```
3. **Use existing tag names** where possible to avoid creating duplicate filter buttons. Current tags: `React`, `Next.js`, `TypeScript`, `JavaScript`, `Vite`, `Node.js`, `React Native`, `Express`.

4. **Update `README.md`** — add the project to the Highlighted Projects table if it is notable.

5. **Update `CHANGELOG.md`** — add an entry under `Unreleased`:
   ```
   - Added project: <title>
   ```

6. **Run and verify**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

## Do not

- Add a project with a broken image URL — verify the URL resolves before committing.
- Add new hostnames to `remotePatterns` in `next.config.ts` without reviewing the security implications.
- Use a tag that doesn't match the technology actually used in the project.
