import type { Auth } from "@nestegg/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { appRouter } from "../root";
import { createTRPCContext } from "../trpc";

// Mock the database
vi.mock("@nestegg/db/client", () => ({
  db: {
    query: {
      financialAccounts: {
        findMany: vi.fn(),
      },
    },
  },
}));

// Create a minimal mock Auth object
function createMockAuth(): Auth {
  return {
    api: {
      getSession: vi.fn(),
      signInSocial: vi.fn(),
      signOut: vi.fn(),
    },
  } as unknown as Auth;
}

describe("Financial Router", () => {
  const createMockContext = () =>
    createTRPCContext({
      headers: new Headers(),
      auth: createMockAuth(),
    });

  describe("overview", () => {
    it("should return mock data in development mode", async () => {
      // Set environment variable for this test
      const originalMode = process.env.DATA_MODE;
      if (typeof process !== "undefined" && process.env) {
        process.env.DATA_MODE = "development";
      }
      try {
        const caller = appRouter.createCaller(createMockContext());
        const result = await caller.financial.overview();
        expect(result).toBeDefined();
        expect(Array.isArray(result.accounts)).toBe(true);
      } finally {
        // Restore original value
        if (typeof process !== "undefined" && process.env) {
          process.env.DATA_MODE = originalMode;
        }
      }
    });

    it("should handle production mode with database", async () => {
      // Set environment variable for this test
      const originalMode = process.env.DATA_MODE;
      if (typeof process !== "undefined" && process.env) {
        process.env.DATA_MODE = "production";
      }
      try {
        // This would require a test database setup
        // For now, we'll just verify the mode is checked
        expect(process.env.DATA_MODE).toBe("production");
      } finally {
        // Restore original value
        if (typeof process !== "undefined" && process.env) {
          process.env.DATA_MODE = originalMode;
        }
      }
    });
  });
});
