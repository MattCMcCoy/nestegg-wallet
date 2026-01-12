"use client";

import type { AccountCategory, AccountWithBalances } from "@acme/types";
import {
  getAccountsByCategory,
  getCategoryTitle,
  mapAccountToViewModel,
} from "@acme/types";

import { AccountCard } from "./AccountCard";

interface CategorySectionProps {
  accounts: AccountWithBalances[];
  categories: AccountCategory[];
  title: string;
}

function calculateCategoryTotal(accounts: AccountWithBalances[]): number {
  return accounts.reduce((sum, account) => {
    const latestBalance = account.balances[account.balances.length - 1];
    const balance = latestBalance?.current ?? 0;
    // For liabilities, use absolute value for percentage calculation
    return sum + Math.abs(balance);
  }, 0);
}

export function CategorySection({
  accounts,
  categories,
  title,
}: CategorySectionProps) {
  const totalAssets = calculateCategoryTotal(accounts);

  return (
    <div className="bg-background dark:border-border-dark dark:bg-background-dark space-y-6 rounded-lg border p-4">
      <h2 className="font-mono text-xs font-semibold">{title}</h2>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryAccounts = getAccountsByCategory(accounts, category);
          if (categoryAccounts.length === 0) return null;

          const categoryTotal = calculateCategoryTotal(categoryAccounts);
          const percentage =
            totalAssets > 0 ? (categoryTotal / totalAssets) * 100 : 0;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold">
                  {getCategoryTitle(category)}
                </h3>
                <span className="text-muted-foreground font-mono text-xs">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="space-y-2 pl-4">
                {categoryAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={mapAccountToViewModel(account)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
