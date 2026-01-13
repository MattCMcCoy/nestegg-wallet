import { afterAll, beforeAll } from "vitest";

// Helper to safely set environment variables in test environment
function setEnvVar(key: string, value: string): void {
  if (typeof process !== "undefined" && process.env) {
    process.env[key] = value;
  }
}

// Mock environment variables for auth tests
setEnvVar("AUTH_SECRET", "test-secret-key-for-testing-only");
setEnvVar("AUTH_DISCORD_ID", "test-discord-id");
setEnvVar("AUTH_DISCORD_SECRET", "test-discord-secret");
setEnvVar("POSTGRES_URL", "postgresql://test:test@localhost:5432/test");

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
