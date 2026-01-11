import type { AccountType, AccountWithBalances } from "./type";
import { ACCOUNT_TYPE_META } from "./type";

export interface AccountViewModel {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  mask?: string;
}

// Small, reusable helper
function getLatestBalance(account: AccountWithBalances): number {
  const latest = account.balances.at(-1)?.current;
  return Number(latest ?? 0);
}

export function mapAccountToViewModel(
  account: AccountWithBalances,
): AccountViewModel {
  const meta = ACCOUNT_TYPE_META[account.type];

  return {
    id: account.id,
    name: account.name,
    type: account.type,
    balance: getLatestBalance(account),
    color: meta.color,
    mask: account.mask,
  };
}
