import { authRouter } from "./router/auth";
import { transactionRouter } from "./router/financial/transaction";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  transactions: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
