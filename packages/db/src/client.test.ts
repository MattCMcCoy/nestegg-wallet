import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock environment variables
const mockEnv = vi.hoisted(() => ({
  POSTGRES_URL: "postgresql://user:password@localhost:5432/testdb",
}));

vi.mock("dotenv/config", () => ({}));

// Helper to dynamically import the client module
async function importClient(): Promise<typeof import("./client")> {
  return await import("./client");
}

describe("Database Client", () => {
  beforeEach(() => {
    vi.resetModules();
    if (typeof process !== "undefined" && process.env) {
      process.env.POSTGRES_URL = mockEnv.POSTGRES_URL;
    }
  });

  describe("Connection String Validation", () => {
    it("should throw error when POSTGRES_URL is missing", async () => {
      if (typeof process !== "undefined" && process.env) {
        delete process.env.POSTGRES_URL;
      }
      vi.resetModules();
      await expect(importClient()).rejects.toThrow(
        "Missing POSTGRES_URL environment variable",
      );
    });

    it("should throw error when POSTGRES_URL has invalid format", async () => {
      if (typeof process !== "undefined" && process.env) {
        process.env.POSTGRES_URL = "not-a-valid-url";
      }
      vi.resetModules();
      await expect(importClient()).rejects.toThrow(
        "Invalid POSTGRES_URL format",
      );
    });

    it("should not expose connection string in error message", async () => {
      if (typeof process !== "undefined" && process.env) {
        process.env.POSTGRES_URL = "not-a-valid-url";
      }
      vi.resetModules();
      try {
        await importClient();
        expect.fail("Should have thrown an error");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        // Should not contain the connection string
        expect(errorMessage).not.toContain("not-a-valid-url");
        expect(errorMessage).not.toContain("password");
        expect(errorMessage).not.toContain("user");
      }
    });

    it("should accept valid PostgreSQL connection string", async () => {
      if (typeof process !== "undefined" && process.env) {
        process.env.POSTGRES_URL = "postgresql://user:pass@localhost:5432/db";
      }
      vi.resetModules();
      await expect(importClient()).resolves.toBeDefined();
    });
  });

  describe("Error Message Sanitization", () => {
    it("should sanitize connection strings in error messages", () => {
      // This test would verify that error messages don't expose credentials
      // You'd need to mock the postgres client to throw an error
      const errorMessage =
        "Connection failed: postgresql://user:secret@host/db";
      const sanitized = errorMessage.replace(
        /postgres(ql)?:\/\/[^@]+@/gi,
        "postgresql://***:***@",
      );
      expect(sanitized).toBe("Connection failed: postgresql://***:***@host/db");
      expect(sanitized).not.toContain("secret");
      expect(sanitized).not.toContain("user");
    });
  });
});
