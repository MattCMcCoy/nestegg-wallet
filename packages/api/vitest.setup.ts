import { beforeAll, afterAll } from "vitest";

// Mock environment variables for API tests
process.env.DATA_MODE = "development";
process.env.AUTH_SECRET = "test-secret";
process.env.AUTH_DISCORD_ID = "test-id";
process.env.AUTH_DISCORD_SECRET = "test-secret";
process.env.POSTGRES_URL = "postgresql://test:test@localhost:5432/test";

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
