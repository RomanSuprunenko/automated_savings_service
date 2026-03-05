import { publicProcedure, createRouter } from "@/server/trpc";
import { z } from "zod";
import { suggestTransfer } from "@/server/savings-logic";

export const savingsRouter = createRouter({
  insights: publicProcedure.query(() => {
    return {
      insights: [
        { label: "Safe to save this month", value: "$420" },
        { label: "Projected cash buffer", value: "$1,980" },
        { label: "Next transfer", value: "Mar 18" }
      ]
    };
  }),
  createSuggestion: publicProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        scheduledFor: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return {
        status: "scheduled",
        ...input
      };
    }),
  autoSuggest: publicProcedure.mutation(async () => {
    return suggestTransfer();
  })
});
