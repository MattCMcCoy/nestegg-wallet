import { z } from "zod";

import { and, desc, eq, gte } from "@nestegg/db";
import {
  accountBalances,
  CreateAccountBalanceSchema,
  CreateFinancialAccountSchema,
  CreateFinancialConnectionSchema,
  CreateTransactionSchema,
  financialAccounts,
  financialConnections,
  transactions,
} from "@nestegg/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const financialRouter = createTRPCRouter({
  // ============================
  // Connections (Plaid Items)
  // ============================
  connections: createTRPCRouter({
    all: protectedProcedure.query(({ ctx }) => {
      return ctx.db.query.financialConnections.findMany({
        where: eq(financialConnections.userId, ctx.session.user.id),
        orderBy: desc(financialConnections.createdAt),
      });
    }),

    create: protectedProcedure
      .input(CreateFinancialConnectionSchema)
      .mutation(({ ctx, input }) => {
        return ctx.db.insert(financialConnections).values({
          ...input,
          userId: ctx.session.user.id,
        });
      }),
  }),

  // ============================
  // Accounts
  // ============================
  accounts: createTRPCRouter({
    all: protectedProcedure.query(({ ctx }) => {
      return ctx.db.query.financialAccounts.findMany({
        where: eq(financialAccounts.userId, ctx.session.user.id),
        orderBy: desc(financialAccounts.createdAt),
      });
    }),

    byConnection: protectedProcedure
      .input(z.string())
      .query(({ ctx, input }) => {
        return ctx.db.query.financialAccounts.findMany({
          where: eq(financialAccounts.connectionId, input),
        });
      }),

    create: protectedProcedure
      .input(CreateFinancialAccountSchema)
      .mutation(({ ctx, input }) => {
        return ctx.db.insert(financialAccounts).values({
          ...input,
          userId: ctx.session.user.id,
        });
      }),
  }),

  // ============================
  // Transactions
  // ============================
  transactions: createTRPCRouter({
    byAccount: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
      return ctx.db.query.transactions.findMany({
        where: eq(transactions.accountId, input),
        orderBy: desc(transactions.date),
      });
    }),

    create: protectedProcedure
      .input(CreateTransactionSchema)
      .mutation(({ ctx, input }) => {
        return ctx.db.insert(transactions).values(input);
      }),
  }),

  // ============================
  // Account Balances (Time Series)
  // ============================
  balances: createTRPCRouter({
    /**
     * All balances for one account (last 3 years)
     */
    byAccount: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      return ctx.db.query.accountBalances.findMany({
        where: and(
          eq(accountBalances.accountId, input),
          gte(accountBalances.asOf, threeYearsAgo),
        ),
        orderBy: accountBalances.asOf,
      });
    }),

    /**
     * Latest balance for one account
     */
    latest: protectedProcedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const [row] = await ctx.db
          .select()
          .from(accountBalances)
          .where(eq(accountBalances.accountId, input))
          .orderBy(desc(accountBalances.asOf))
          .limit(1);

        return row ?? null;
      }),

    /**
     * Insert (or upsert) a balance snapshot
     */
    upsert: protectedProcedure
      .input(CreateAccountBalanceSchema)
      .mutation(({ ctx, input }) => {
        return ctx.db
          .insert(accountBalances)
          .values(input)
          .onConflictDoUpdate({
            target: [accountBalances.accountId, accountBalances.asOf],
            set: {
              current: input.current,
              available: input.available,
              limit: input.limit,
              isoCurrencyCode: input.isoCurrencyCode,
            },
          });
      }),
  }),

  // ============================
  // Account Overview (🔥 most used)
  // ============================
  overview: protectedProcedure.query(async ({ ctx }) => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    // Make sure to include balances in the output
    const accounts = await ctx.db.query.financialAccounts.findMany({
      where: eq(financialAccounts.userId, ctx.session.user.id),
      with: {
        balances: {
          where: gte(accountBalances.asOf, threeYearsAgo),
          orderBy: accountBalances.asOf,
        },
      },
    });

    return accounts;
  }),
});
