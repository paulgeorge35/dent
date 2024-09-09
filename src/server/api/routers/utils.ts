import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const utilsRouter = createTRPCRouter({
  getCounties: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.county.findMany({
      cacheStrategy: {
        ttl: 60 * 60 * 24 * 14,
      },
    });
  }),

  getCities: publicProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      return (
        await ctx.db.county.findFirst({
          where: { name: input },
          select: { cities: true },
          cacheStrategy: {
            ttl: 60 * 60 * 24 * 14,
          },
        })
      )?.cities;
    }),
});
