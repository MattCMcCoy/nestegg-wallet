import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@nestegg/eslint-config/base";
import { nextjsConfig } from "@nestegg/eslint-config/nextjs";
import { reactConfig } from "@nestegg/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
