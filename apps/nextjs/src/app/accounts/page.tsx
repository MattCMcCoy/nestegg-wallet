import { HydrateClient, prefetch } from "~/trpc/server";
import AccountsPageClient from "./client";

export default async function AccountsPage() {
    await prefetch.accounts.overview();

    return (
        <HydrateClient>
            <AccountsPageClient />
        </HydrateClient>
    );
}
