import { afterAll, beforeAll } from "vitest";

// Helper to set environment variables in test environment
// In Node.js, process is always defined, so we can safely access it
function setEnvVar(key: string, value: string): void {
  // eslint-disable-next-line no-restricted-properties
  process.env[key] = value;
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
