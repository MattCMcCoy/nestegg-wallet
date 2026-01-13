import { beforeAll, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

// Mock Next.js modules
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error(`Redirect to ${url}`) as Error & {
      digest?: string;
    };
    error.digest = `NEXT_REDIRECT;${url}`;
    throw error;
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

beforeAll(() => {
  // Setup before all tests
});
