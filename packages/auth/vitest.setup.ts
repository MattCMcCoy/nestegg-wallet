import { beforeAll, afterAll } from "vitest";

// Mock environment variables for auth tests
process.env.AUTH_SECRET = "test-secret-key-for-testing-only";
process.env.AUTH_DISCORD_ID = "test-discord-id";
process.env.AUTH_DISCORD_SECRET = "test-discord-secret";
process.env.POSTGRES_URL = "postgresql://test:test@localhost:5432/test";

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
