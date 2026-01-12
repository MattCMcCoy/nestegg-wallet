import { defineConfig } from "eslint/config";

import { baseConfig } from "@nestegg/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
