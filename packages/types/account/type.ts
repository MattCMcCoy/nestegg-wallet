// ==============================
// Account domain
// ==============================

export enum AccountType {
  // Cash Accounts
  CHECKING = "checking",
  SAVINGS = "savings",
  MONEY_MARKET = "money_market",
  CD = "cd",
  CASH = "cash",
  PREPAID = "prepaid",

  // Investment Accounts
  INVESTMENT_401K = "investment_401k",
  ROTH_IRA = "roth_ira",
  TRADITIONAL_IRA = "traditional_ira",
  BROKERAGE = "brokerage",
  CRYPTO = "crypto",
  HSA = "hsa",
  OTHER_INVESTMENT = "other_investment",

  // Property
  PROPERTY = "property",
  REAL_ESTATE = "real_estate",

  // Liabilities - Credit Cards
  CREDIT_CARD = "credit_card",

  // Liabilities - Loans
  AUTO_LOAN = "auto_loan",
  STUDENT_LOAN = "student_loan",
  MORTGAGE = "mortgage",
  PERSONAL_LOAN = "personal_loan",
  HELOC = "heloc",
  OTHER_LOAN = "other_loan",

  // Generic fallbacks
  OTHER = "other",
}

// ==============================
// Account Categories
// ==============================

export enum AccountCategory {
  // Asset Categories
  CASH = "cash",
  INVESTMENTS = "investments",
  PROPERTY = "property",
  OTHER_ASSETS = "other_assets",

  // Liability Categories
  CREDIT_CARDS = "credit_cards",
  LOANS = "loans",
  OTHER_LIABILITIES = "other_liabilities",
}

// ==============================
// Type Classification
// ==============================

export const ASSET_ACCOUNT_TYPES = new Set<AccountType>([
  // Cash
  AccountType.CHECKING,
  AccountType.SAVINGS,
  AccountType.MONEY_MARKET,
  AccountType.CD,
  AccountType.CASH,
  AccountType.PREPAID,

  // Investments
  AccountType.INVESTMENT_401K,
  AccountType.ROTH_IRA,
  AccountType.TRADITIONAL_IRA,
  AccountType.BROKERAGE,
  AccountType.CRYPTO,
  AccountType.HSA,
  AccountType.OTHER_INVESTMENT,

  // Property
  AccountType.PROPERTY,
  AccountType.REAL_ESTATE,

  // Generic
  AccountType.OTHER,
]);

export const LIABILITY_ACCOUNT_TYPES = new Set<AccountType>([
  // Credit Cards
  AccountType.CREDIT_CARD,

  // Loans
  AccountType.AUTO_LOAN,
  AccountType.STUDENT_LOAN,
  AccountType.MORTGAGE,
  AccountType.PERSONAL_LOAN,
  AccountType.HELOC,
  AccountType.OTHER_LOAN,
]);

export const isAssetType = (type: AccountType) => ASSET_ACCOUNT_TYPES.has(type);

export const isLiabilityType = (type: AccountType) =>
  LIABILITY_ACCOUNT_TYPES.has(type);

// ==============================
// Category Mapping
// ==============================

export const ACCOUNT_TYPE_TO_CATEGORY: Record<AccountType, AccountCategory> = {
  // Cash
  [AccountType.CHECKING]: AccountCategory.CASH,
  [AccountType.SAVINGS]: AccountCategory.CASH,
  [AccountType.MONEY_MARKET]: AccountCategory.CASH,
  [AccountType.CD]: AccountCategory.CASH,
  [AccountType.CASH]: AccountCategory.CASH,
  [AccountType.PREPAID]: AccountCategory.CASH,

  // Investments
  [AccountType.INVESTMENT_401K]: AccountCategory.INVESTMENTS,
  [AccountType.ROTH_IRA]: AccountCategory.INVESTMENTS,
  [AccountType.TRADITIONAL_IRA]: AccountCategory.INVESTMENTS,
  [AccountType.BROKERAGE]: AccountCategory.INVESTMENTS,
  [AccountType.CRYPTO]: AccountCategory.INVESTMENTS,
  [AccountType.HSA]: AccountCategory.INVESTMENTS,
  [AccountType.OTHER_INVESTMENT]: AccountCategory.INVESTMENTS,

  // Property
  [AccountType.PROPERTY]: AccountCategory.PROPERTY,
  [AccountType.REAL_ESTATE]: AccountCategory.PROPERTY,

  // Liabilities - Credit Cards
  [AccountType.CREDIT_CARD]: AccountCategory.CREDIT_CARDS,

  // Liabilities - Loans
  [AccountType.AUTO_LOAN]: AccountCategory.LOANS,
  [AccountType.STUDENT_LOAN]: AccountCategory.LOANS,
  [AccountType.MORTGAGE]: AccountCategory.LOANS,
  [AccountType.PERSONAL_LOAN]: AccountCategory.LOANS,
  [AccountType.HELOC]: AccountCategory.LOANS,
  [AccountType.OTHER_LOAN]: AccountCategory.LOANS,

  // Generic
  [AccountType.OTHER]: AccountCategory.OTHER_ASSETS,
};

export const getAccountCategory = (type: AccountType): AccountCategory => {
  return ACCOUNT_TYPE_TO_CATEGORY[type];
};

// ==============================
// Category Metadata
// ==============================

interface CategoryMeta {
  title: string;
  pluralTitle: string;
}

export const ACCOUNT_CATEGORY_META: Record<AccountCategory, CategoryMeta> = {
  [AccountCategory.CASH]: { title: "Cash", pluralTitle: "Cash" },
  [AccountCategory.INVESTMENTS]: {
    title: "Investments",
    pluralTitle: "Investments",
  },
  [AccountCategory.PROPERTY]: { title: "Property", pluralTitle: "Property" },
  [AccountCategory.OTHER_ASSETS]: {
    title: "Other Assets",
    pluralTitle: "Other Assets",
  },
  [AccountCategory.CREDIT_CARDS]: {
    title: "Credit Cards",
    pluralTitle: "Credit Cards",
  },
  [AccountCategory.LOANS]: { title: "Loans", pluralTitle: "Loans" },
  [AccountCategory.OTHER_LIABILITIES]: {
    title: "Other Liabilities",
    pluralTitle: "Other Liabilities",
  },
};

// ==============================
// Category Colors
// ==============================

export const ACCOUNT_CATEGORY_COLORS: Record<AccountCategory, string> = {
  [AccountCategory.CASH]: "#3b82f6", // blue-500
  [AccountCategory.INVESTMENTS]: "#a855f7", // purple-500
  [AccountCategory.PROPERTY]: "#f59e0b", // amber-500
  [AccountCategory.OTHER_ASSETS]: "#6b7280", // gray-500
  [AccountCategory.CREDIT_CARDS]: "#ef4444", // red-500
  [AccountCategory.LOANS]: "#eab308", // yellow-600
  [AccountCategory.OTHER_LIABILITIES]: "#4b5563", // gray-600
};

export const getCategoryColor = (category: AccountCategory): string =>
  ACCOUNT_CATEGORY_COLORS[category];

// ==============================
// Category Display Order
// ==============================

export const ASSET_CATEGORY_ORDER: AccountCategory[] = [
  AccountCategory.CASH,
  AccountCategory.INVESTMENTS,
  AccountCategory.PROPERTY,
  AccountCategory.OTHER_ASSETS,
];

export const LIABILITY_CATEGORY_ORDER: AccountCategory[] = [
  AccountCategory.CREDIT_CARDS,
  AccountCategory.LOANS,
  AccountCategory.OTHER_LIABILITIES,
];

// ==============================
// Type Metadata
// ==============================

interface AccountTypeMeta {
  title: string;
  shortTitle?: string;
  color: string;
  category: AccountCategory;
}

export const ACCOUNT_TYPE_META: Record<AccountType, AccountTypeMeta> = {
  // Cash
  [AccountType.CHECKING]: {
    title: "Checking",
    color: "bg-blue-500",
    category: AccountCategory.CASH,
  },
  [AccountType.SAVINGS]: {
    title: "Savings",
    color: "bg-green-500",
    category: AccountCategory.CASH,
  },
  [AccountType.MONEY_MARKET]: {
    title: "Money Market",
    color: "bg-cyan-500",
    category: AccountCategory.CASH,
  },
  [AccountType.CD]: {
    title: "Certificate of Deposit",
    shortTitle: "CD",
    color: "bg-teal-500",
    category: AccountCategory.CASH,
  },
  [AccountType.CASH]: {
    title: "Cash",
    color: "bg-emerald-500",
    category: AccountCategory.CASH,
  },
  [AccountType.PREPAID]: {
    title: "Prepaid",
    color: "bg-lime-500",
    category: AccountCategory.CASH,
  },

  // Investments
  [AccountType.INVESTMENT_401K]: {
    title: "401(k)",
    shortTitle: "401k",
    color: "bg-purple-500",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.ROTH_IRA]: {
    title: "Roth IRA",
    shortTitle: "Roth IRA",
    color: "bg-violet-500",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.TRADITIONAL_IRA]: {
    title: "Traditional IRA",
    shortTitle: "IRA",
    color: "bg-indigo-500",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.BROKERAGE]: {
    title: "Brokerage",
    shortTitle: "Individual",
    color: "bg-purple-600",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.CRYPTO]: {
    title: "Cryptocurrency",
    shortTitle: "Crypto",
    color: "bg-orange-500",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.HSA]: {
    title: "Health Savings Account",
    shortTitle: "HSA",
    color: "bg-pink-500",
    category: AccountCategory.INVESTMENTS,
  },
  [AccountType.OTHER_INVESTMENT]: {
    title: "Other Investment",
    color: "bg-fuchsia-500",
    category: AccountCategory.INVESTMENTS,
  },

  // Property
  [AccountType.PROPERTY]: {
    title: "Property",
    color: "bg-amber-500",
    category: AccountCategory.PROPERTY,
  },
  [AccountType.REAL_ESTATE]: {
    title: "Real Estate",
    color: "bg-yellow-500",
    category: AccountCategory.PROPERTY,
  },

  // Credit Cards
  [AccountType.CREDIT_CARD]: {
    title: "Credit Card",
    color: "bg-red-500",
    category: AccountCategory.CREDIT_CARDS,
  },

  // Loans
  [AccountType.AUTO_LOAN]: {
    title: "Auto Loan",
    color: "bg-yellow-600",
    category: AccountCategory.LOANS,
  },
  [AccountType.STUDENT_LOAN]: {
    title: "Student Loan",
    color: "bg-yellow-700",
    category: AccountCategory.LOANS,
  },
  [AccountType.MORTGAGE]: {
    title: "Mortgage",
    color: "bg-amber-600",
    category: AccountCategory.LOANS,
  },
  [AccountType.PERSONAL_LOAN]: {
    title: "Personal Loan",
    color: "bg-yellow-500",
    category: AccountCategory.LOANS,
  },
  [AccountType.HELOC]: {
    title: "Home Equity Line of Credit",
    shortTitle: "HELOC",
    color: "bg-orange-600",
    category: AccountCategory.LOANS,
  },
  [AccountType.OTHER_LOAN]: {
    title: "Other Loan",
    color: "bg-yellow-800",
    category: AccountCategory.LOANS,
  },

  // Generic
  [AccountType.OTHER]: {
    title: "Other",
    color: "bg-gray-500",
    category: AccountCategory.OTHER_ASSETS,
  },
};

// ==============================
// Convenience helpers
// ==============================

export const getAccountTitle = (type: AccountType) =>
  ACCOUNT_TYPE_META[type].title;

export const getAccountShortTitle = (type: AccountType) =>
  ACCOUNT_TYPE_META[type].shortTitle ?? ACCOUNT_TYPE_META[type].title;

export const getAccountColor = (type: AccountType) =>
  ACCOUNT_TYPE_META[type].color;

export const getCategoryTitle = (category: AccountCategory) =>
  ACCOUNT_CATEGORY_META[category].title;

export const getCategoryPluralTitle = (category: AccountCategory) =>
  ACCOUNT_CATEGORY_META[category].pluralTitle;

// ==============================
// Grouping helpers
// ==============================

export const groupAccountsByCategory = <T extends AccountWithBalances>(
  accounts: T[],
): Record<AccountCategory, T[]> => {
  const grouped = {} as Record<AccountCategory, T[]>;
  // Initialize all categories
  Object.values(AccountCategory).forEach((category) => {
    grouped[category] = [];
  });

  accounts.forEach((account) => {
    const category = getAccountCategory(account.type);
    grouped[category].push(account);
  });

  return grouped;
};

export const getAccountsByCategory = <T extends AccountWithBalances>(
  accounts: T[],
  category: AccountCategory,
): T[] => {
  return accounts.filter(
    (account) => getAccountCategory(account.type) === category,
  );
};

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
