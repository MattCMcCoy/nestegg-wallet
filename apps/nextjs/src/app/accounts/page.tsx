import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AccountsPageClient } from "./client";

export default function AccountsPage() {
  // Prefetch is fire-and-forget; errors are handled silently.
  // If prefetch fails, the client will fetch the data on mount.
  prefetch(trpc.financial.overview.queryOptions());

  return (
    <HydrateClient>
      <AccountsPageClient />
    </HydrateClient>
  );
}
