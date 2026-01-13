# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit and integration tests, and [React Testing Library](https://testing-library.com/react) for component tests.

## Quick Start

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run tests once (CI mode)
pnpm test:run
```

## Test Structure

Tests are organized by package/app:

```
packages/
  ├─ db/
  │   └─ src/
  │       └─ client.test.ts          # Database client tests
  ├─ api/
  │   └─ src/
  │       └─ router/
  │           └─ financial.test.ts   # tRPC router tests
  └─ auth/
      └─ vitest.setup.ts             # Auth test setup
apps/
  └─ nextjs/
      ├─ vitest.setup.ts             # Next.js test setup
      └─ src/
          └─ app/
              └─ _components/
                  └─ auth-showcase.test.tsx  # Component tests
```

## Writing Tests

### Testing Database Code

```typescript
import { describe, it, expect } from "vitest";
import { db } from "@nestegg/db/client";

describe("Database Operations", () => {
  it("should query accounts", async () => {
    // Your test here
  });
});
```

### Testing tRPC Procedures

```typescript
import { describe, it, expect } from "vitest";
import { appRouter } from "../root";
import { createTRPCContext } from "../trpc";

describe("Financial Router", () => {
  it("should return accounts", async () => {
    const ctx = createTRPCContext({
      headers: new Headers(),
      auth: mockAuth,
    });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.financial.overview();
    expect(result).toBeDefined();
  });
});
```

### Testing React Components

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Testing Server Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { signInAction } from "./auth-actions";

describe("signInAction", () => {
  it("should handle errors gracefully", async () => {
    // Mock dependencies
    vi.mock("~/auth/server", () => ({
      auth: { api: { signInSocial: vi.fn() } },
    }));
    
    // Test your action
  });
});
```

## Test Coverage

We aim for good test coverage, especially for:
- Security-critical code (auth, database connections)
- Business logic (financial calculations, data transformations)
- Error handling paths
- Edge cases

## Mocking

### Environment Variables

Use `vitest.setup.ts` files to set up test environment variables:

```typescript
process.env.DATA_MODE = "development";
process.env.POSTGRES_URL = "postgresql://test:test@localhost:5432/test";
```

### Next.js Modules

Next.js modules are mocked in `apps/nextjs/vitest.setup.ts`:
- `next/headers` - Headers and cookies
- `next/navigation` - Router, redirect, etc.

### Database

For database tests, you can:
1. Use a test database (recommended for integration tests)
2. Mock the database client (for unit tests)

## CI Integration

Tests run automatically in CI. Make sure all tests pass before merging PRs.

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Use descriptive test names** - "should return accounts for authenticated user" is better than "test1"
3. **Keep tests isolated** - Each test should be independent
4. **Mock external dependencies** - Don't make real API calls or database connections in unit tests
5. **Test error cases** - Don't just test the happy path
6. **Keep tests fast** - Unit tests should be fast; save slow tests for integration/E2E

## Example Test Files

See the example test files in:
- `packages/db/src/client.test.ts` - Database client tests
- `packages/api/src/router/financial.test.ts` - tRPC router tests
- `apps/nextjs/src/app/_components/auth-showcase.test.tsx` - Component tests
