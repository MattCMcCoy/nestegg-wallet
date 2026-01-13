import { afterAll, beforeAll } from "vitest";

// Helper to safely set environment variables in test environment
function setEnvVar(key: string, value: string): void {
  if (typeof process !== "undefined" && process.env) {
    process.env[key] = value;
  }
}

// Mock environment variables for API tests
setEnvVar("DATA_MODE", "development");
setEnvVar("AUTH_SECRET", "test-secret");
setEnvVar("AUTH_DISCORD_ID", "test-id");
setEnvVar("AUTH_DISCORD_SECRET", "test-secret");
setEnvVar("POSTGRES_URL", "postgresql://test:test@localhost:5432/test");

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
