import type { AccountType } from "@acme/types";
import { AccountType as AccountTypeEnum } from "@acme/types";

/**
 * Generate mock financial accounts with balance history
 * Returns data in the same format as the database query
 */
export function generateMockAccounts(userId: string) {
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const now = new Date();
  const account1Id = `mock-account-1-${userId}`;
  const account2Id = `mock-account-2-${userId}`;
  const account3Id = `mock-account-3-${userId}`;
  const account4Id = `mock-account-4-${userId}`;
  const account5Id = `mock-account-5-${userId}`;
  const account6Id = `mock-account-6-${userId}`;

  const accounts = [
    {
      id: account1Id,
      userId,
      connectionId: `mock-connection-1-${userId}`,
      name: "Chase Total Checking",
      type: AccountTypeEnum.CHECKING,
      subtype: "checking",
      mask: "1234",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateBalanceHistory(5000, 8000, threeYearsAgo, now, false, account1Id),
    },
    {
      id: account2Id,
      userId,
      connectionId: `mock-connection-1-${userId}`,
      name: "High Yield Savings",
      type: AccountTypeEnum.SAVINGS,
      subtype: "savings",
      mask: "5678",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateBalanceHistory(25000, 35000, threeYearsAgo, now, false, account2Id),
    },
    {
      id: account3Id,
      userId,
      connectionId: `mock-connection-1-${userId}`,
      name: "Chase Sapphire Reserve",
      type: AccountTypeEnum.CREDIT_CARD,
      subtype: "credit card",
      mask: "9012",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateCreditBalanceHistory(2000, 5000, threeYearsAgo, now, account3Id),
    },
    {
      id: account4Id,
      userId,
      connectionId: `mock-connection-2-${userId}`,
      name: "Fidelity Investment Account",
      type: AccountTypeEnum.BROKERAGE,
      subtype: "brokerage",
      mask: "3456",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateBalanceHistory(15000, 25000, threeYearsAgo, now, true, account4Id),
    },
    {
      id: account5Id,
      userId,
      connectionId: `mock-connection-2-${userId}`,
      name: "Auto Loan",
      type: AccountTypeEnum.AUTO_LOAN,
      subtype: "auto",
      mask: "7890",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateLoanBalanceHistory(18000, 5000, threeYearsAgo, now, account5Id),
    },
    {
      id: account6Id,
      userId,
      connectionId: `mock-connection-1-${userId}`,
      name: "401(k) Retirement",
      type: AccountTypeEnum.INVESTMENT_401K,
      subtype: "401k",
      mask: "2468",
      currency: "USD",
      createdAt: threeYearsAgo,
      updatedAt: now,
      balances: generateBalanceHistory(120000, 180000, threeYearsAgo, now, true, account6Id),
    },
  ];

  return accounts;
}

/**
 * Generate monthly balance history with realistic fluctuations
 */
function generateBalanceHistory(
  startBalance: number,
  endBalance: number,
  startDate: Date,
  endDate: Date,
  volatile = false,
  accountId: string,
) {
  const balances: Array<{
    id: string;
    accountId: string;
    current: string;
    available?: string | null;
    limit?: string | null;
    isoCurrencyCode: string | null;
    asOf: Date;
    createdAt: Date;
  }> = [];

  const months = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  const monthlyChange = (endBalance - startBalance) / months;
  const volatility = volatile ? 0.15 : 0.05; // 15% volatility for investments, 5% for others

  let currentBalance = startBalance;
  const currentDate = new Date(startDate);

  for (let i = 0; i <= months; i++) {
    // Add some random fluctuation
    const fluctuation = currentBalance * volatility * (Math.random() - 0.5) * 2;
    const balance = Math.max(0, currentBalance + fluctuation);

    balances.push({
      id: `mock-balance-${i}-${currentDate.getTime()}`,
      accountId,
      current: balance.toFixed(2),
      available: balance.toFixed(2),
      limit: null,
      isoCurrencyCode: "USD",
      asOf: new Date(currentDate),
      createdAt: new Date(currentDate),
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentBalance += monthlyChange;
  }

  return balances;
}

/**
 * Generate credit card balance history (negative balances)
 */
function generateCreditBalanceHistory(
  startBalance: number,
  creditLimit: number,
  startDate: Date,
  endDate: Date,
  accountId: string,
) {
  const balances: Array<{
    id: string;
    accountId: string;
    current: string;
    available?: string | null;
    limit?: string | null;
    isoCurrencyCode: string | null;
    asOf: Date;
    createdAt: Date;
  }> = [];

  const months = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  const monthlyChange = (startBalance - 500) / months; // Gradually pay down

  let currentBalance = startBalance;
  const currentDate = new Date(startDate);

  for (let i = 0; i <= months; i++) {
    const fluctuation = currentBalance * 0.1 * (Math.random() - 0.5) * 2;
    const balance = Math.max(0, Math.min(creditLimit, currentBalance + fluctuation));
    const available = creditLimit - balance;

    balances.push({
      id: `mock-balance-credit-${i}-${currentDate.getTime()}`,
      accountId,
      current: balance.toFixed(2),
      available: available.toFixed(2),
      limit: creditLimit.toFixed(2),
      isoCurrencyCode: "USD",
      asOf: new Date(currentDate),
      createdAt: new Date(currentDate),
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
    currentBalance = Math.max(0, currentBalance - monthlyChange);
  }

  return balances;
}

/**
 * Generate loan balance history (decreasing over time)
 */
function generateLoanBalanceHistory(
  startBalance: number,
  endBalance: number,
  startDate: Date,
  endDate: Date,
  accountId: string,
) {
  const balances: Array<{
    id: string;
    accountId: string;
    current: string;
    available?: string | null;
    limit?: string | null;
    isoCurrencyCode: string | null;
    asOf: Date;
    createdAt: Date;
  }> = [];

  const months = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  const monthlyPayment = (startBalance - endBalance) / months;

  let currentBalance = startBalance;
  const currentDate = new Date(startDate);

  for (let i = 0; i <= months; i++) {
    balances.push({
      id: `mock-balance-loan-${i}-${currentDate.getTime()}`,
      accountId,
      current: currentBalance.toFixed(2),
      available: null,
      limit: null,
      isoCurrencyCode: "USD",
      asOf: new Date(currentDate),
      createdAt: new Date(currentDate),
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
    currentBalance = Math.max(endBalance, currentBalance - monthlyPayment);
  }

  return balances;
}

