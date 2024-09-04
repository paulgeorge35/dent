import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";
import { z } from "zod";
import { ServiceUnitSchema } from "prisma/generated/zod";
import { env } from "@/env";

export const createSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  unit_price: z.number(),
  unit: ServiceUnitSchema,
  image: z.string().optional(),
  tags: z.array(z.string()),
  keepInventory: z.boolean().optional().default(false),
  stock: z.number().optional().default(0),
});

export const materialRouter = createTRPCRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user!.tenantId;

    const materials = await ctx.db.material.findMany({
      where: {
        tenantId,
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
    return materials;
  }),

  get: tenantProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const material = await ctx.db.material.findUnique({
      where: {
        id: input,
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
    return material;
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.material.create({
        data: {
          ...input,
          tenantId,
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...createSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.material.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db.material.update({
      where: { id: input },
      data: { isActive: false },
    });
  }),
});
