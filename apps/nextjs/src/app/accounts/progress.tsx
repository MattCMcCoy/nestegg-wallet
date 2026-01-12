import type { AccountCategory, AccountWithBalances } from "@acme/types";
import {
  ASSET_CATEGORY_ORDER,
  getCategoryColor,
  getCategoryTitle,
  groupAccountsByCategory,
  LIABILITY_CATEGORY_ORDER,
  splitAccounts,
} from "@acme/types";
import { Progress } from "@acme/ui";
import { Field, FieldLabel } from "@acme/ui/field";

interface AccountsProgressProps {
  accounts: AccountWithBalances[];
}

export function AccountsProgress({ accounts }: AccountsProgressProps) {
  const { assets, liabilities } = splitAccounts(accounts);

  // Helper: sum balances in a list
  const sumBalances = (list: AccountWithBalances[]) =>
    list.reduce((sum, acc) => {
      const latestBalance = acc.balances[acc.balances.length - 1]?.current ?? 0;
      return sum + latestBalance;
    }, 0);

  const totalAssets = sumBalances(assets);
  const totalLiabilities = sumBalances(liabilities);

  // Group by category
  const assetGroups = groupAccountsByCategory(assets);
  const liabilityGroups = groupAccountsByCategory(liabilities);

  const renderCategoryBar = (
    category: AccountCategory,
    categoryAccounts: AccountWithBalances[],
    total: number,
  ) => {
    if (categoryAccounts.length === 0) return null;

    const categoryTotal = sumBalances(categoryAccounts);
    const percentage = total
      ? Math.round((Math.abs(categoryTotal) / total) * 100)
      : 0;

    return (
      <Field key={category}>
        <FieldLabel htmlFor={`progress-${category}`}>
          <span>{getCategoryTitle(category)}</span>
          <span className="ml-auto">{percentage}%</span>
        </FieldLabel>
        <div className="h-3 w-full overflow-hidden rounded">
          <style
            dangerouslySetInnerHTML={{
              __html: `#progress-${category} [data-slot="progress-indicator"] { background-color: ${getCategoryColor(category)} !important; }`,
            }}
          />
          <Progress
            id={`progress-${category}`}
            value={percentage}
            className="h-3 w-full overflow-hidden rounded"
          />
        </div>
      </Field>
    );
  };

  return (
    <div className="bg-background dark:border-border-dark dark:bg-background-dark mb-2 h-fit max-w-[30vw] flex-1 space-y-6 rounded-lg border p-4">
      <h5 className="font-bold">Assets</h5>
      <div className="space-y-3">
        {ASSET_CATEGORY_ORDER.map((category) =>
          renderCategoryBar(category, assetGroups[category], totalAssets),
        )}
      </div>

      <h5 className="font-bold">Liabilities</h5>
      <div className="space-y-3">
        {LIABILITY_CATEGORY_ORDER.map((category) =>
          renderCategoryBar(
            category,
            liabilityGroups[category],
            totalLiabilities,
          ),
        )}
      </div>
    </div>
  );
}
