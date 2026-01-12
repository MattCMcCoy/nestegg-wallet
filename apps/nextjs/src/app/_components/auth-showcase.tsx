import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@nestegg/ui/button";

import { auth, getSession } from "~/auth/server";

async function signInAction() {
  "use server";
  try {
    const headersList = await headers();
    console.log("Attempting Discord sign-in...");

    // Validate environment variables are present
    if (!process.env.AUTH_DISCORD_ID || !process.env.AUTH_DISCORD_SECRET) {
      console.error("Missing Discord OAuth credentials");
      throw new Error(
        "Discord OAuth is not configured. Please set AUTH_DISCORD_ID and AUTH_DISCORD_SECRET.",
      );
    }

    const res = await auth.api.signInSocial({
      headers: headersList,
      body: {
        provider: "discord",
        callbackURL: "/",
      },
    });
    console.log("Sign-in response:", { hasUrl: !!res.url, res });
    if (!res.url) {
      console.error("No URL returned from signInSocial", res);
      throw new Error(
        "No URL returned from signInSocial. Please check your Discord OAuth configuration.",
      );
    }
    redirect(res.url);
  } catch (error) {
    // Don't re-throw redirect errors (they're expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      error.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Sign in error details:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    // Re-throw to show error to user via Next.js error handling
    throw error;
  }
}

export async function AuthShowcase() {
  let session;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Failed to get session in AuthShowcase:", error);
    session = null;
  }

  if (!session) {
    return (
      <form action={signInAction}>
        <Button size="lg" type="submit">
          Sign in with Discord
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            try {
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/");
            } catch (error) {
              console.error("Sign out error:", error);
              throw error;
            }
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
