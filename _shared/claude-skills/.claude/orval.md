---
name: orval
description: Orval API client generation skill. Covers generating TypeScript API clients from OpenAPI/Swagger specs, React Query integration, custom transformers, mock generation, and optimal configuration patterns.
user-invocable: true
---

# Orval API Client Generation Skill

## What this Skill is for

Use this Skill when the user asks for:

- Generating TypeScript API clients from OpenAPI specs
- Setting up Orval configuration
- React Query / TanStack Query integration
- Custom request/response transformers
- Mock service worker (MSW) generation
- API client architecture decisions

## Default stack decisions (opinionated)

1. **React Query integration first**

- Generate hooks with `@tanstack/react-query` by default
- Use mutation hooks for POST/PUT/PATCH/DELETE
- Use query hooks for GET requests

2. **Type safety**

- Generate strict TypeScript types from OpenAPI schemas
- Use `zod` for runtime validation when needed
- Export types alongside hooks for reuse

3. **File organization**

- One file per API tag/endpoint group
- Separate types file for shared schemas
- Custom axios instance in dedicated file

4. **Mock generation**

- Generate MSW handlers for development/testing
- Use faker for realistic mock data
- Keep mocks in sync with spec changes

## Operating procedure

### 1. Initial setup

Install dependencies:

```bash
npm install orval -D
npm install @tanstack/react-query axios
```

### 2. Configuration (orval.config.ts)

Basic configuration:

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './openapi.yaml', // or URL
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/models',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      prettier: true,
    },
  },
});
```

Advanced configuration with custom instance:

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/models',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useSuspenseQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
```

### 3. Custom Axios instance

Create `src/api/custom-instance.ts`:

```ts
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;
```

### 4. Generate clients

```bash
npx orval
# or add to package.json scripts
# "api:generate": "orval"
```

### 5. Usage patterns

Using generated query hooks:

```tsx
import { useGetUsers, useCreateUser } from '@/api/generated/users';

function UsersPage() {
  const { data: users, isLoading } = useGetUsers();
  const createUser = useCreateUser();

  const handleCreate = () => {
    createUser.mutate({ data: { name: 'John' } });
  };

  if (isLoading) return <Loading />;
  return <UserList users={users} onCreate={handleCreate} />;
}
```

Using generated types:

```tsx
import type { User, CreateUserBody } from '@/api/models';

function UserForm({ onSubmit }: { onSubmit: (data: CreateUserBody) => void }) {
  // Form implementation
}
```

### 6. Mock generation (MSW)

Add to orval config:

```ts
export default defineConfig({
  api: {
    // ... other config
    output: {
      // ... other output config
      mock: true,
    },
  },
});
```

Use in tests or dev server:

```ts
import { setupServer } from 'msw/node';
import { getGetUsersMock } from '@/api/generated/users.msw';

const server = setupServer(...getGetUsersMock());
```

## Common patterns

**Infinite queries:**

```ts
export default defineConfig({
  api: {
    output: {
      override: {
        query: {
          useInfinite: true,
          useInfiniteQueryParam: 'cursor',
        },
      },
    },
  },
});
```

**Custom transformers:**

```ts
export default defineConfig({
  api: {
    output: {
      override: {
        transformer: './src/api/transformer.ts',
      },
    },
  },
});
```

**Multiple APIs:**

```ts
export default defineConfig({
  mainApi: {
    input: './specs/main.yaml',
    output: { target: './src/api/main' },
  },
  authApi: {
    input: './specs/auth.yaml',
    output: { target: './src/api/auth' },
  },
});
```

## Troubleshooting

- **Circular references:** Use `mode: 'tags-split'` to break cycles
- **Large specs:** Enable `clean: true` to remove stale files
- **Type conflicts:** Use `override.components.schemas` for manual type mappings
- **Missing endpoints:** Check OpenAPI spec tags match expected grouping
