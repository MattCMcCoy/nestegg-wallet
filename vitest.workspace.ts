import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // Test Next.js app
  {
    test: {
      name: "nextjs",
      include: ["apps/nextjs/**/*.{test,spec}.{js,ts,tsx}"],
      environment: "jsdom",
      setupFiles: ["./apps/nextjs/vitest.setup.ts"],
    },
  },
  // Test API package
  {
    test: {
      name: "api",
      include: ["packages/api/**/*.{test,spec}.{js,ts,tsx}"],
      environment: "node",
      setupFiles: ["./packages/api/vitest.setup.ts"],
    },
  },
  // Test DB package
  {
    test: {
      name: "db",
      include: ["packages/db/**/*.{test,spec}.{js,ts,tsx}"],
      environment: "node",
      setupFiles: ["./packages/db/vitest.setup.ts"],
    },
  },
  // Test Auth package
  {
    test: {
      name: "auth",
      include: ["packages/auth/**/*.{test,spec}.{js,ts,tsx}"],
      environment: "node",
      setupFiles: ["./packages/auth/vitest.setup.ts"],
    },
  },
]);
