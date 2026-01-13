import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

import { initAuth } from "@nestegg/auth";

import { env } from "~/env";

const baseUrl =
  env.VERCEL_ENV === "production"
    ? env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : "http://localhost:3000"
    : env.VERCEL_ENV === "preview"
      ? env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : "http://localhost:3000"
      : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : baseUrl,
  secret: env.AUTH_SECRET,
  discordClientId: env.AUTH_DISCORD_ID,
  discordClientSecret: env.AUTH_DISCORD_SECRET,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () => {
  try {
    const headersList = await headers();
    return await auth.api.getSession({ headers: headersList });
  } catch (error) {
    console.error("Error getting session:", {
      error,
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
});
