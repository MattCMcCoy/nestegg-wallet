import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AccountsPageClient } from "./client";

export default async function AccountsPage() {
  try {
    prefetch(trpc.financial.overview.queryOptions());
  } catch (error) {
    // If prefetch fails (e.g., user not authenticated), continue without prefetching
    console.error("Failed to prefetch financial overview:", error);
  }

  return (
    <HydrateClient>
      <AccountsPageClient />
    </HydrateClient>
  );
}
