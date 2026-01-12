import type { AccountType, AccountWithBalances } from "@nestegg/types";
import { ACCOUNT_TYPE_META, mapAccountToViewModel } from "@nestegg/types";

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
            <div className="font-mono text-xs font-semibold">
              {ACCOUNT_TYPE_META[account.type].title}
              <AccountCard
                key={account.id}
                account={mapAccountToViewModel(account)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
