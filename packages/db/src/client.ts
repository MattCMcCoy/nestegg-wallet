import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Missing POSTGRES_URL environment variable. Please set it in your environment variables.",
  );
}

// Validate connection string format
try {
  const url = new URL(connectionString);
  if (!url.hostname) {
    throw new Error("Invalid POSTGRES_URL: missing hostname");
  }
} catch (error) {
  if (error instanceof TypeError) {
    throw new Error(
      "Invalid POSTGRES_URL format. Expected a valid PostgreSQL connection string.",
    );
  }
  throw error;
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, {
  prepare: false,
  onnotice: () => {
    // Suppress notices
  },
  connection: {
    application_name: "nestegg-wallet",
  },
});

// Test connection on initialization (non-blocking)
client
  .unsafe("SELECT 1")
  .then(() => {
    console.log("✅ Database connection successful");
  })
  .catch((error: unknown) => {
    // Sanitize error message to avoid exposing connection string credentials
    let errorMessage = "Database connection failed";
    if (error instanceof Error) {
      // Remove any potential connection string from error message
      errorMessage = error.message.replace(
        /postgres(ql)?:\/\/[^@]+@/gi,
        "postgresql://***:***@",
      );
    }
    let errorCode: string | undefined;
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string"
    ) {
      errorCode = error.code;
    } else if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "number"
    ) {
      errorCode = String(error.code);
    }
    let hostname: string | undefined;
    try {
      hostname = new URL(connectionString).hostname;
    } catch {
      // If URL parsing fails, don't expose hostname
      hostname = undefined;
    }
    console.error("❌ Database connection failed:", {
      message: errorMessage,
      code: errorCode,
      hostname,
      hint:
        "Please check:\n" +
        "1. Your database is running and accessible\n" +
        "2. The POSTGRES_URL is correct\n" +
        "3. If using Supabase, ensure your database is not paused\n" +
        "4. Network/firewall settings allow connections",
    });
  });

export const db = drizzle(client, {
  schema, // ✅ Pass your schema here
  casing: "snake_case",
});
