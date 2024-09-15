import { env } from "@/env";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";

export const createSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().optional(),
  unit_price: z.number().positive(),
  unit: z.string().trim(),
  image: z.string().optional(),
  tags: z.array(z.string().trim()).optional(),
  keepInventory: z.boolean().optional().default(false),
  stock: z.number().optional().default(0),
});

const pagination = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
});

const sort = z
  .string()
  .default("createdAt.asc")
  .transform((str) => {
    const [orderBy, order] = str.split(".");
    const validOrderBy = [
      "id",
      "name",
      "description",
      "unit_price",
      "stock",
      "createdAt",
      "updatedAt",
    ];
    const validOrder = ["asc", "desc"];

    return {
      orderBy:
        orderBy && validOrderBy.includes(orderBy) ? orderBy : "createdAt",
      order: order && validOrder.includes(order) ? order : "asc",
    };
  });

export const materialRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          name: z.string().optional(),
        })
        .merge(pagination)
        .merge(z.object({ sort: sort })),
    )
    .query(
      async ({
        ctx,
        input: {
          search,
          name,
          page,
          per_page,
          sort: { order, orderBy },
        },
      }) => {
        const tenantId = ctx.session.user!.tenantId;

        const content = await ctx.db.material.findMany({
          where: {
            tenantId,
            isActive: true,
            ...(name
              ? {
                  name: { contains: name, mode: "insensitive" },
                }
              : {}),
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    {
                      description: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    { tags: { hasSome: search.split(" ") } },
                  ],
                }
              : {}),
          },

          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        const count = await ctx.db.material.count({
          where: {
            tenantId,
            isActive: true,
            ...(name
              ? {
                  name: { contains: name, mode: "insensitive" },
                }
              : {}),
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    {
                      description: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    { tags: { hasSome: search.split(" ") } },
                  ],
                }
              : {}),
          },
        });

        return {
          content,
          count,
          pageCount: Math.ceil(count / (per_page ?? 1)),
        };
      },
    ),

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

      return await ctx.db.$transaction(async (tx) => {
        const material = await tx.material.findUnique({
          where: { id },
        });

        if (!material) {
          throw new Error("Material not found");
        }

        if (data.unit_price !== material.unit_price) {
          await tx.price.create({
            data: {
              type: "MATERIAL",
              unit_price: data.unit_price,
              entityId: id,
            },
          });
        }

        return await tx.material.update({
          where: { id },
          data,
        });
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db.material.update({
      where: { id: input },
      data: { isActive: false },
    });
  }),
});
