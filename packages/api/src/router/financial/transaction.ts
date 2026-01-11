import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq, desc } from "@acme/db";
import {
  transactions,
  CreateTransactionSchema,
} from "@acme/db/schema";

import { protectedProcedure } from "../../trpc";

export const transactionRouter = {
  // -------------------------
  // List transactions for an account
  // -------------------------
  byAccount: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.transactions.findMany({
        where: eq(transactions.accountId, input.accountId),
        orderBy: desc(transactions.date),
      });
    }),

  // -------------------------
  // Create transaction
  // -------------------------
create: protectedProcedure
  .input(CreateTransactionSchema)
  .mutation(async ({ ctx, input }) => {
    const account = await ctx.db.query.financialAccounts.findFirst({
      where: (a, { and, eq }) =>
        and(
          eq(a.id, input.accountId),
          eq(a.userId, ctx.session.user.id),
        ),
    });

    if (!account) {
      throw new Error("Account not found");
    }

    return ctx.db.insert(transactions).values({
      ...input,
      amount: input.amount.toString(), // ✅ REQUIRED for decimal
    });
  }),


  // -------------------------
  // Delete transaction
  // -------------------------
  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(transactions)
        .where(eq(transactions.id, input));
    }),
} satisfies TRPCRouterRecord;
