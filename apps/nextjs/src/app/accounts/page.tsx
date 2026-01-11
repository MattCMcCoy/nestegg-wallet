import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AccountsPageClient } from "./client";

export default function AccountsPage() {
  prefetch(trpc.financial.overview.queryOptions());

  return (
    <HydrateClient>
      <AccountsPageClient />
    </HydrateClient>
  );
}
