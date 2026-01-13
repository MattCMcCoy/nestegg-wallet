"use client";

import { useEffect } from "react";

function isDatabaseError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("enotfound") ||
    message.includes("getaddrinfo") ||
    message.includes("failed query") ||
    message.includes("database connection") ||
    message.includes("postgres") ||
    message.includes("supabase")
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  const isDbError = isDatabaseError(error);

  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>

      {isDbError ? (
        <div className="max-w-2xl space-y-4 text-center">
          <p className="text-muted-foreground">
            Database connection error detected.
          </p>
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-left">
            <h3 className="mb-2 font-semibold">How to fix:</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>
                <strong>Check if your Supabase database is paused:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Go to your Supabase dashboard</li>
                  <li>
                    If the database shows as "Paused", click "Restore" or
                    "Resume"
                  </li>
                  <li>Free tier databases pause after 7 days of inactivity</li>
                </ul>
              </li>
              <li>
                <strong>
                  Use the connection pooler (recommended for Vercel):
                </strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>
                    Go to Supabase → Settings → Database → Connection Pooling
                  </li>
                  <li>
                    Copy the "Pooler" connection string (port 6543, IPv4
                    compatible)
                  </li>
                  <li>
                    Update POSTGRES_URL in Vercel with the pooler connection
                    string
                  </li>
                </ul>
              </li>
              <li>
                <strong>Verify your POSTGRES_URL in Vercel:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Go to Vercel project settings → Environment Variables</li>
                  <li>Check that POSTGRES_URL is set correctly</li>
                  <li>
                    It should look like:{" "}
                    <code className="bg-muted rounded px-1 text-xs">
                      postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres
                    </code>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Wait a few minutes</strong> after restoring the
                database, then try again
              </li>
            </ol>
          </div>
          <p className="text-muted-foreground text-xs">
            Error: {error.message}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
      )}

      {error.digest && (
        <p className="text-muted-foreground text-xs">
          Error ID: {error.digest}
        </p>
      )}

      <button
        onClick={reset}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2"
      >
        Try again
      </button>
    </div>
  );
}
