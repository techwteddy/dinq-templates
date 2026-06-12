# ADR 004 — Testing Strategy: Jest + React Testing Library

**Date:** 2025-01-20  
**Status:** Accepted

---

## Context

The project needed a testing approach that catches regressions without becoming a maintenance burden. Options considered: Jest + RTL, Vitest + RTL, Playwright (E2E only), no tests.

## Decision

Use **Jest 30 + React Testing Library** for unit/integration tests. No E2E tests at this stage.

## Reasons

- RTL's philosophy ("test behavior, not implementation") aligns with how the components work: user-visible content and interactions.
- Jest is the most established test runner in the Next.js ecosystem with ts-jest for TypeScript support.
- Component-level tests (render, click, modal open/close, filter behavior) cover the meaningful risk surface of this project — there is no complex business logic or async data fetching to test at the E2E level.
- E2E tests (Playwright/Cypress) would add significant CI time and flakiness for a static portfolio with no API calls. Can be added if the project gains dynamic features.

## Coverage threshold

70% line coverage is enforced as the minimum. This was chosen as a practical floor that:
- Forces coverage of the main rendering and interaction paths
- Does not demand tests for trivial getters/setters or static markup

## Consequences

- Every new component ships with a test file in `src/__tests__/`.
- Every removed component has its test file deleted.
- Test files follow the pattern: `src/__tests__/<ComponentName>.test.tsx`.
- Do not test internal state, implementation details, or CSS classes — test what the user sees and can do.
- If E2E testing is added in the future, Playwright is preferred (official Next.js recommendation).
