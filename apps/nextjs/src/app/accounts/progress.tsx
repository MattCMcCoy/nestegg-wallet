import { Field, FieldLabel } from "@nestegg/ui/field";
import { Progress } from "@nestegg/ui";


interface AccountsProgressProps {
    accounts: AccountWithBalances[];
}

const colorClasses: Record<AccountType, string> = {
    checking: "bg-blue-500",
    savings: "bg-green-500",
    credit: "bg-red-500",
    investment: "bg-purple-500",
    loan: "bg-yellow-500",
    other: "bg-gray-500",
};

export function AccountsProgress({ accounts }: AccountsProgressProps) {
    const { assets, liabilities } = splitAccounts(accounts);

    // Helper: sum balances in a list
    const sumBalances = (list: AccountWithBalances[]) =>
        list.reduce((sum, acc) => sum + acc.balance, 0);

    const totalAssets = sumBalances(assets);
    const totalLiabilities = sumBalances(liabilities);

    const renderBar = (account: AccountWithBalances, total: number) => {
        const value = total
            ? Math.round((Math.abs(account.balance) / total) * 100)
            : 0;

        return (
            <Field key={account.id}>
                <FieldLabel htmlFor={`progress-${account.id}`}>
                    <span>{account.name}</span>
                    <span className="ml-auto">{Math.abs(value)}%</span>
                </FieldLabel>
                <div className="h-3 w-full overflow-hidden rounded">
                    <Progress
                        id={`progress-${account.id}`}
                        value={Math.abs(value)}
                        className={`h-3 w-full overflow-hidden rounded [&>div]:${colorClasses[account.type]}`}
                    />
                </div>
            </Field>
        );
    };

    return (
        <div className="bg-background dark:border-border-dark dark:bg-background-dark mb-2 h-fit max-w-[30vw] flex-1 space-y-6 rounded-lg border p-4">
            <h5 className="font-bold">Assets</h5>
            {assets.map((a) => renderBar(a, totalAssets))}

            <h5 className="font-bold">Liabilities</h5>
            {liabilities.map((a) => renderBar(a, totalLiabilities))}
        </div>
    );
}
