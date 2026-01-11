import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq, desc } from "@acme/db";
import {
  financialAccounts,
  CreateFinancialAccountSchema,
} from "@acme/db/schema";

import { protectedProcedure } from "../../trpc";

export const financialAccountRouter = {
  // -------------------------
  // List user accounts
  // -------------------------
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.financialAccounts.findMany({
      where: eq(financialAccounts.userId, ctx.session.user.id),
      orderBy: desc(financialAccounts.createdAt),
    });
  }),

  // -------------------------
  // Get account by ID (user-scoped)
  // -------------------------
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.financialAccounts.findFirst({
        where: (accounts, { and, eq }) =>
          and(
            eq(accounts.id, input.id),
            eq(accounts.userId, ctx.session.user.id)
          ),
      });
    }),

  // -------------------------
  // Create account
  // -------------------------
  create: protectedProcedure
    .input(CreateFinancialAccountSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(financialAccounts).values({
        ...input,
        userId: ctx.session.user.id, // enforce ownership server-side
      });
    }),

  // -------------------------
  // Delete account
  // -------------------------
  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(financialAccounts)
        .where(
          eq(financialAccounts.id, input),
        );
    }),
} satisfies TRPCRouterRecord;
