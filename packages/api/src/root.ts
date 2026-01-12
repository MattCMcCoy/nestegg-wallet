import { authRouter } from "./router/auth";
import { financialRouter } from "./router/financial";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  financial: financialRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
