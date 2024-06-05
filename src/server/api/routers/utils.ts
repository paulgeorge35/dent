import { createTRPCRouter, publicProcedure } from "../trpc";

export const utilsRouter = createTRPCRouter({
  getCounties: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.county.findMany();
  }),
});
