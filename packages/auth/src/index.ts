import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@nestegg/db/client";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  discordClientId: string;
  discordClientSecret: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      expo(),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      discord: {
        clientId: options.discordClientId,
        clientSecret: options.discordClientSecret,
        redirectURI: `${options.baseUrl}/api/auth/callback/discord`,
      },
    },
    trustedOrigins: ["expo://"],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", {
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  code: (error as { code?: string }).code,
                  cause: error.cause,
                }
              : error,
          context: ctx,
        });

        // If it's a database connection error, provide helpful guidance
        if (
          error instanceof Error &&
          (error.message.includes("ENOTFOUND") ||
            error.message.includes("getaddrinfo") ||
            error.message.includes("Failed query"))
        ) {
          console.error(
            "\n⚠️  Database connection error detected.\n" +
              "This usually means:\n" +
              "1. Your database is not accessible (check if Supabase database is paused)\n" +
              "2. The POSTGRES_URL environment variable is incorrect\n" +
              "3. Network/firewall issues\n\n" +
              "Please check your Vercel environment variables and ensure your database is running.",
          );
        }
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
