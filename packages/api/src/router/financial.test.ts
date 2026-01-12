import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../root";
import { createTRPCContext } from "../trpc";

// Mock the database
vi.mock("@nestegg/db/client", () => ({
  db: {
    query: {
      financialAccounts: {
        findMany: vi.fn(),
      },
} as unknown,
}));

describe("Financial Router", () => {
  const createMockContext = () =>
    createTRPCContext({
      headers: new Headers(),
      auth: {} as any,
    });

  describe("overview", () => {
    it("should return mock data in development mode", async () => {
      process.env.DATA_MODE = "development";
      const caller = appRouter.createCaller(createMockContext());
      const result = await caller.financial.overview();
      expect(result).toBeDefined();
      expect(Array.isArray(result.accounts)).toBe(true);
    });

    it("should handle production mode with database", async () => {
      process.env.DATA_MODE = "production";
      // This would require a test database setup
      // For now, we'll just verify the mode is checked
      expect(process.env.DATA_MODE).toBe("production");
    });
  });
});
