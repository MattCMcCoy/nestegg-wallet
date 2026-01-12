import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@nestegg/ui/button";

import { auth, getSession } from "~/auth/server";

async function signInAction() {
  "use server";
  try {
    const headersList = await headers();
    console.log("Attempting Discord sign-in...");
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
      throw new Error("No URL returned from signInSocial. Please check your Discord OAuth configuration.");
    }
    redirect(res.url);
  } catch (error) {
    console.error("Sign in error details:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function AuthShowcase() {
  const session = await getSession();

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
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
