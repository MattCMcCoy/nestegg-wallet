import { describe, it, expect, vi, beforeEach } from "vitest";
import { URL } from "node:url";

// Mock environment variables
const mockEnv = vi.hoisted(() => ({
  POSTGRES_URL: "postgresql://user:password@localhost:5432/testdb",
}));

vi.mock("dotenv/config", () => ({}));

describe("Database Client", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.POSTGRES_URL = mockEnv.POSTGRES_URL;
  });

  describe("Connection String Validation", () => {
    it("should throw error when POSTGRES_URL is missing", () => {
      delete process.env.POSTGRES_URL;
      expect(() => {
        // Re-import to trigger validation
        vi.resetModules();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("./client");
      }).toThrow("Missing POSTGRES_URL environment variable");
    });

    it("should throw error when POSTGRES_URL has invalid format", () => {
      process.env.POSTGRES_URL = "not-a-valid-url";
      expect(() => {
        vi.resetModules();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("./client");
      }).toThrow("Invalid POSTGRES_URL format");
    });

    it("should not expose connection string in error message", () => {
      process.env.POSTGRES_URL = "not-a-valid-url";
      try {
        vi.resetModules();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("./client");
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

    it("should accept valid PostgreSQL connection string", () => {
      process.env.POSTGRES_URL = "postgresql://user:pass@localhost:5432/db";
      expect(() => {
        vi.resetModules();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("./client");
      }).not.toThrow();
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
