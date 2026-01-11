"use client";

import { useTRPC } from "~/trpc/react";
import { AccountsLineChart } from "./AccountsLineChart";
import { AccountSection } from "./AccountSection";
import { AccountsProgress } from "./AccountsProgress";
import { useSuspenseQuery } from "@tanstack/react-query";

type ChartRow = {
    date: string;
    total: number;
} & Record<string, number | string>;

export function AccountsPageClient() {
    const trpc = useTRPC();

    const { data: accountsRaw } = useSuspenseQuery(
        trpc.financial.overview.queryOptions()
    );

    if (accountsRaw.length === 0) return <div>Loading…</div>;

    // -------------------------
    // Map to our model
    // -------------------------
    const accounts: AccountWithBalances[] = accountsRaw.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type as AccountType,
        balance: acc.balances[acc.balances.length - 1]?.current ?? 0,
        color: ACCOUNT_TYPE_COLORS[acc.type as AccountType] ?? "bg-gray-500",
        mask: acc.mask ?? undefined,
        balances: acc.balances.map(b => ({
            asOf: b.asOf,
            current: Number(b.current),
            available: b.available ? Number(b.available) : undefined,
            limit: b.limit ? Number(b.limit) : undefined,
        })),
    }));

    // -------------------------
    // Build chart data
    // -------------------------
    const allDates = Array.from(
        new Set(
            accounts.flatMap(acc =>
                acc.balances.map(b => b.asOf.toISOString().slice(0, 10))
            )
        )
    ).sort();

    const chartData: ChartRow[] = allDates.map(date => {
        let total = 0;
        const row: ChartRow = { date, total: 0 };

        for (const acc of accounts) {
            const bal = acc.balances.find(
                b => b.asOf.toISOString().slice(0, 10) === date
            );
            const value = bal ? Number(bal.current) : 0;
            row[acc.id] = value;
            total += value;
        }

        row.total = total;
        return row;
    });

    return (
        <div className="flex w-screen flex-col gap-6 p-6">
            <div className="h-[40vh] w-full">
                <AccountsLineChart data={chartData} />
            </div>

            <div className="flex w-full gap-6">
                <div className="flex-1 space-y-4">
                    <AccountSection
                        title="Assets"
                        accounts={accounts}
                        allowedTypes={ASSET_ACCOUNT_TYPES}
                    />

                    <AccountSection
                        title="Liabilities"
                        accounts={accounts}
                        allowedTypes={LIABILITY_ACCOUNT_TYPES}
                    />
                </div>

                <AccountsProgress accounts={accounts} />
            </div>
        </div>
    );
}
