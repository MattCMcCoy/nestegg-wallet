import { defineConfig } from "eslint/config";

import { baseConfig } from "@nestegg/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
  },
  baseConfig,
  {
    files: ["vitest.setup.ts"],
    rules: {
      "no-restricted-properties": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
);
