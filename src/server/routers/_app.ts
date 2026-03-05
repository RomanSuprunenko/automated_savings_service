import { createRouter } from "@/server/trpc";
import { savingsRouter } from "@/server/routers/savings";

export const appRouter = createRouter({
  savings: savingsRouter
});

export type AppRouter = typeof appRouter;
