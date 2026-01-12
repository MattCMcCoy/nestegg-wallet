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
      `Invalid POSTGRES_URL format: ${connectionString}. Expected a valid PostgreSQL connection string.`,
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
  .catch((error) => {
    console.error("❌ Database connection failed:", {
      message: error.message,
      code: error.code,
      hostname: new URL(connectionString).hostname,
      hint: "Please check:\n" +
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
