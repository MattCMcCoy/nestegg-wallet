import { authRouter } from "./router/auth";
import { financialRouter } from "./router/financial";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  financial: financialRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
