"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import type { AccountType, AccountWithBalances } from "@acme/types";
import {
  ASSET_ACCOUNT_TYPES,
  ASSET_CATEGORY_ORDER,
  LIABILITY_ACCOUNT_TYPES,
  LIABILITY_CATEGORY_ORDER,
} from "@acme/types";

import { useTRPC } from "~/trpc/react";
import { AccountsLineChart } from "./AccountsLineChart";
import { CategorySection } from "./CategorySection";
import { AccountsProgress } from "./progress";
import {
  AccountSectionSkeleton,
  AccountsLineChartSkeleton,
  AccountsProgressSkeleton,
} from "./skeletons";
import { SpendingCalendar } from "./SpendingCalendar";

type ChartRow = {
  date: string;
  total: number;
} & Record<string, number | string>;

// Type for account with balances relation from Drizzle query
interface AccountWithBalancesRelation {
  id: string;
  name: string;
  type: string;
  mask: string | null;
  balances: {
    asOf: Date;
    current: string | number;
    available?: string | number | null;
    limit?: string | number | null;
  }[];
}

export function AccountsPageClient() {
  const trpc = useTRPC();

  const { data: accountsRaw } = useSuspenseQuery(
    trpc.financial.overview.queryOptions(),
  );

  // Show skeletons when there are no accounts
  if (accountsRaw.length === 0) {
    return (
      <div className="flex w-screen flex-col gap-6 p-6">
        <div className="h-[40vh] w-full">
          <AccountsLineChartSkeleton />
        </div>

        <div className="flex w-full gap-6">
          <div className="flex-1 space-y-4">
            <AccountSectionSkeleton title="Assets" count={3} />
            <AccountSectionSkeleton title="Liabilities" count={2} />
          </div>

          <AccountsProgressSkeleton />
        </div>
      </div>
    );
  }

  // -------------------------
  // Map to our model
  // -------------------------
  const accounts: AccountWithBalances[] = accountsRaw.map((acc) => {
    // Type assertion for account with balances relation
    const accountWithBalances = acc as AccountWithBalancesRelation;
    const balances = accountWithBalances.balances;

    return {
      id: acc.id,
      name: acc.name,
      type: acc.type as AccountType,
      mask: acc.mask ?? undefined,
      balances: balances.map((b) => ({
        asOf: b.asOf,
        current: Number(b.current),
        available: b.available ? Number(b.available) : undefined,
        limit: b.limit ? Number(b.limit) : undefined,
      })),
    };
  });

  // -------------------------
  // Build chart data
  // -------------------------
  const allDates = Array.from(
    new Set(
      accounts.flatMap((acc) =>
        acc.balances.map((b) => b.asOf.toISOString().slice(0, 10)),
      ),
    ),
  ).sort();

  const chartData: ChartRow[] = allDates.map((date) => {
    let total = 0;
    const row: ChartRow = { date, total: 0 };

    for (const acc of accounts) {
      const bal = acc.balances.find(
        (b) => b.asOf.toISOString().slice(0, 10) === date,
      );
      const value = bal ? Number(bal.current) : 0;
      row[acc.id] = value;
      total += value;
    }

    row.total = total;
    return row;
  });

  // Split accounts into assets and liabilities
  const assetAccounts = accounts.filter((acc) =>
    ASSET_ACCOUNT_TYPES.has(acc.type),
  );
  const liabilityAccounts = accounts.filter((acc) =>
    LIABILITY_ACCOUNT_TYPES.has(acc.type),
  );

  return (
    <div className="flex w-screen flex-col gap-6 p-6">
      <div className="h-[40vh] w-full">
        <AccountsLineChart data={chartData} />
      </div>

      <div className="flex w-full gap-6">
        <div className="flex-1 space-y-4">
          <CategorySection
            title="Assets"
            accounts={assetAccounts}
            categories={ASSET_CATEGORY_ORDER}
          />

          <CategorySection
            title="Liabilities"
            accounts={liabilityAccounts}
            categories={LIABILITY_CATEGORY_ORDER}
          />
        </div>

        <AccountsProgress accounts={accounts} />
      </div>

      <SpendingCalendar
        data={{
          "2026-01-15": -125.5, // Shows as "$-125.50"
          "2026-01-20": "High", // Shows as custom label
        }}
        onDayClick={(date) => console.log("Clicked:", date)}
      />
    </div>
  );
}
