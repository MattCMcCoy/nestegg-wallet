import { defineConfig } from "eslint/config";

import { baseConfig } from "@nestegg/eslint-config/base";
import { reactConfig } from "@nestegg/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
