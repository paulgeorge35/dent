import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const utilsRouter = createTRPCRouter({
  getCounties: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.county.findMany();
  }),

  getCities: publicProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      return (
        await ctx.db.county.findFirst({
          where: { name: input },
          select: { cities: true },
        })
      )?.cities;
    }),
});
