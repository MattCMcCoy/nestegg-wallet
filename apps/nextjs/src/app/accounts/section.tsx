import type { AccountType, AccountWithBalances } from "@acme/types";
import { mapAccountToViewModel } from "@acme/types";

import { AccountCard } from "./AccountCard";

interface AccountSectionProps {
  title: string;
  accounts: AccountWithBalances[];
  allowedTypes: Set<AccountType>;
}

export function AccountSection({
  title,
  accounts,
  allowedTypes,
}: AccountSectionProps) {
  return (
    <div className="bg-background dark:border-border-dark dark:bg-background-dark space-y-6 rounded-lg border p-4">
      <h2 className="font-mono text-xs font-semibold">{title}</h2>
      <div className="space-y-3">
        {accounts
          .filter((a) => allowedTypes.has(a.type))
          .map((account) => (
            <AccountCard
              key={account.id}
              account={mapAccountToViewModel(account)}
            />
          ))}
      </div>
    </div>
  );
}
