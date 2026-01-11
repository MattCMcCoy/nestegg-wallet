// src/db/schema/financial.ts
import { decimal, index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ----------------------------
// Financial Connections
// ----------------------------
export const financialConnections = pgTable(
  "financial_connections",
  (t) => ({
    id: t.text().primaryKey(),
    userId: t.text().notNull(),
    provider: t.text().notNull(),
    externalId: t.text(),
    institution: t.text(),
    createdAt: t.timestamp().defaultNow(),
    updatedAt: t.timestamp().defaultNow(),
  }),
  (t) => ({
    userIdx: index("financial_connections_user_id_idx").on(t.userId),
  }),
);

// ----------------------------
// Financial Accounts
// ----------------------------
export const financialAccounts = pgTable(
  "financial_accounts",
  (t) => ({
    id: t.text().primaryKey(),
    userId: t.text().notNull(),
    connectionId: t.text().notNull(),
    name: t.text().notNull(),
    type: t.text().notNull(),
    subtype: t.text(),
    mask: t.text(),
    currency: t.text(),
    createdAt: t.timestamp().defaultNow(),
    updatedAt: t.timestamp().defaultNow(),
  }),
  (t) => ({
    userIdx: index("financial_accounts_user_id_idx").on(t.userId),
    connectionIdx: index("financial_accounts_connection_id_idx").on(
      t.connectionId,
    ),
  }),
);

// ----------------------------
// Transactions
// ----------------------------
export const transactions = pgTable(
  "transactions",
  (t) => ({
    id: t.text().primaryKey(),
    accountId: t.text().notNull(),
    date: t.timestamp().notNull(),
    postDate: t.timestamp(),
    description: t.text().notNull(),
    category: t.text(),
    amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
    type: t.text().notNull(),
    createdAt: t.timestamp().defaultNow(),
  }),
  (t) => ({
    accountDateIdx: index("transactions_account_id_date_idx").on(
      t.accountId,
      t.date,
    ),
  }),
);

// ----------------------------
// Account Balances
// ----------------------------
export const accountBalances = pgTable(
  "account_balances",
  (t) => ({
    id: t.text().primaryKey(),
    accountId: t.text().notNull(),
    current: decimal("current", { precision: 14, scale: 2 }).notNull(),
    available: decimal("available", { precision: 14, scale: 2 }),
    limit: decimal("limit", { precision: 14, scale: 2 }),
    isoCurrencyCode: t.text(),
    asOf: t.timestamp().notNull(),
    createdAt: t.timestamp().defaultNow(),
  }),
  (t) => ({
    accountAsOfUnique: uniqueIndex("account_balances_account_id_as_of_idx").on(
      t.accountId,
      t.asOf,
    ),
    accountAsOfIdx: index("account_balances_account_id_as_of_idx2").on(
      t.accountId,
      t.asOf,
    ),
  }),
);

export type FinancialConnection = typeof financialConnections.$inferSelect;
export type NewFinancialConnection = typeof financialConnections.$inferInsert;

export type FinancialAccount = typeof financialAccounts.$inferSelect;
export type NewFinancialAccount = typeof financialAccounts.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type AccountBalance = typeof accountBalances.$inferSelect;
export type NewAccountBalance = typeof accountBalances.$inferInsert;

// ----------------------------
// Zod Insert Schemas (non-deprecated)
// ----------------------------

// optional fields are inferred automatically from table definition
export const CreateFinancialConnectionSchema = createInsertSchema(
  financialConnections,
  {
    userId: z.string(),
    provider: z.string(),
  },
);

export const CreateFinancialAccountSchema = createInsertSchema(
  financialAccounts,
  {
    userId: z.string(),
    connectionId: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    type: z.string().min(1, { message: "Type is required" }),
  },
);

export const CreateTransactionSchema = createInsertSchema(transactions, {
  accountId: z.string(),
  date: z.date(),
  description: z.string().min(1, { message: "Description required" }),
  amount: z.string(),
  type: z.string().min(1, { message: "Type required" }),
});

export const CreateAccountBalanceSchema = createInsertSchema(accountBalances, {
  accountId: z.string(),
  current: z.union([z.number(), z.string()]).transform(String),
  available: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v == null ? undefined : String(v))),
  limit: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v == null ? undefined : String(v))),
  asOf: z.date(),
});
