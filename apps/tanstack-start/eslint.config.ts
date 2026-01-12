import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@nestegg/eslint-config/base";
import { reactConfig } from "@nestegg/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
);
