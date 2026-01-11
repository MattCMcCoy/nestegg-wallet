// ==============================
// Account domain
// ==============================

export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT = "credit",
  INVESTMENT = "investment",
  LOAN = "loan",
  OTHER = "other",
}

export const ASSET_ACCOUNT_TYPES = new Set<AccountType>([
  AccountType.CHECKING,
  AccountType.SAVINGS,
  AccountType.INVESTMENT,
  AccountType.OTHER,
]);

export const LIABILITY_ACCOUNT_TYPES = new Set<AccountType>([
  AccountType.CREDIT,
  AccountType.LOAN,
]);

export const isAssetType = (type: AccountType) => ASSET_ACCOUNT_TYPES.has(type);

export const isLiabilityType = (type: AccountType) =>
  LIABILITY_ACCOUNT_TYPES.has(type);

// ==============================
// UI metadata (display-only)
// ==============================

type AccountTypeMeta = {
  title: string;
  color: string;
};

export const ACCOUNT_TYPE_META: Record<AccountType, AccountTypeMeta> = {
  [AccountType.CHECKING]: { title: "Checking", color: "bg-blue-500" },
  [AccountType.SAVINGS]: { title: "Savings", color: "bg-green-500" },
  [AccountType.CREDIT]: { title: "Credit", color: "bg-red-500" },
  [AccountType.INVESTMENT]: { title: "Investment", color: "bg-purple-500" },
  [AccountType.LOAN]: { title: "Loan", color: "bg-yellow-500" },
  [AccountType.OTHER]: { title: "Other", color: "bg-gray-500" },
};

// Convenience helpers
export const getAccountTitle = (type: AccountType) =>
  ACCOUNT_TYPE_META[type].title;

export const getAccountColor = (type: AccountType) =>
  ACCOUNT_TYPE_META[type].color;

// ==============================
// Data shapes
// ==============================

export interface AccountBalancePoint {
  asOf: Date;
  current: number;
  available?: number;
  limit?: number;
}

export interface AccountWithBalances {
  id: string;
  name: string;
  type: AccountType;
  mask?: string;
  balances: AccountBalancePoint[];
}

// ==============================
// Derived helpers
// ==============================

export const isAsset = (account: AccountWithBalances) =>
  isAssetType(account.type);

export const isLiability = (account: AccountWithBalances) =>
  isLiabilityType(account.type);

export const splitAccounts = (accounts: AccountWithBalances[]) => ({
  assets: accounts.filter(isAsset),
  liabilities: accounts.filter(isLiability),
});
