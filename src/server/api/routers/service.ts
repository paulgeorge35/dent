import { env } from "@/env";
import type { Prisma } from "@prisma/client";
import { ServiceUnitSchema } from "prisma/generated/zod";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";

const createMaterialSchema = z.object({
  quantity: z.number(),
  unit_price: z.number(),
  materialId: z.string(),
});

const createRelatedServiceSchema = z.object({
  order: z.number(),
  quantity: z.number(),
  unit_price: z.number(),
  serviceId: z.string(),
});

const createSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  unit_price: z.number(),
  unit: ServiceUnitSchema,
  duration: z.number(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  categoryId: z.string().optional(),
  materials: z.array(createMaterialSchema),
  relatedServices: z.array(createRelatedServiceSchema),
});

const updateSchema = createSchema.merge(z.object({ id: z.string() }));

const pagination = z.object({
  page: z.number().optional().default(1),
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
      "unit_price",
      "duration",
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

export const serviceRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          name: z.string().optional(),
          tags: z
            .string()
            .optional()
            .transform((val) => val?.split(".")),
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
          tags,
          page,
          per_page,
          sort: { order, orderBy },
        },
      }) => {
        const tenantId = ctx.session.user!.tenantId;

        const content = await ctx.db.service.findMany({
          where: {
            tenantId,
            ...(name
              ? {
                  name: { contains: name, mode: "insensitive" },
                }
              : {}),
            ...(search && {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
              ],
            }),
            ...(tags && {
              tags: { hasEvery: tags },
            }),
          },
          include: {
            children: {
              orderBy: {
                order: "asc",
              },
            },
            materials: {
              include: {
                material: true,
              },
            },
          },
          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        const count = await ctx.db.service.count({
          where: {
            tenantId,
            ...(name
              ? {
                  name: { contains: name, mode: "insensitive" },
                }
              : {}),
            ...(search && {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
              ],
            }),
            ...(tags && {
              tags: { hasEvery: tags },
            }),
          },
        });

        return {
          content,
          count,
          pageCount: Math.ceil(count / (per_page ?? 1)),
        };
      },
    ),

  listSimpleServices: tenantProcedure
    .input(
      z.object({
        search: z.string().optional(),
        ids: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return ctx.db.service.findMany({
        where: {
          tenantId,
          isActive: true,
          children: {
            none: {},
          },
          ...(input.search && {
            name: { contains: input.search },
          }),
          ...(input.ids && {
            id: { in: input.ids },
          }),
        },
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
      });
    }),

  get: tenantProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const service = await ctx.db.service.findUnique({
      where: {
        id: input,
      },
      include: {
        children: {
          orderBy: {
            order: "asc",
          },
        },
        materials: {
          include: {
            material: true,
          },
        },
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
    return service;
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { relatedServices, materials, ...rest } = input;
      const tenantId = ctx.session.user!.tenantId;

      const services = await ctx.db.service.findMany({
        where: {
          id: { in: relatedServices.map((service) => service.serviceId) },
        },
        include: {
          children: true,
          materials: {
            include: {
              material: true,
            },
          },
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      const service = await ctx.db.service.create({
        data: {
          tenantId,
          ...rest,
          materials: {
            createMany: { data: materials },
          },
          children: {
            createMany: {
              data: relatedServices.map((service) => ({
                ...service,
                serviceId: undefined,
                service: services.find(
                  (s) => s.id === service.serviceId,
                ) as unknown as Prisma.JsonObject,
              })),
            },
          },
        },
      });
      return service;
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { relatedServices, materials, id, ...rest } = input;
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.$transaction(async (tx) => {
        const services = await tx.service.findMany({
          where: {
            id: { in: relatedServices.map((service) => service.serviceId) },
          },
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        const service = await tx.service.update({
          where: {
            id: input.id,
          },
          data: {
            tenantId,
            ...rest,
            materials: {
              createMany: { data: materials },
            },
            children: {
              createMany: {
                data: relatedServices.map((service) => ({
                  quantity: service.quantity,
                  unit_price: service.unit_price,
                  service: services.find(
                    (s) => s.id === service.serviceId,
                  ) as unknown as Prisma.JsonObject,
                })),
              },
            },
          },
        });

        await tx.service.update({
          where: {
            id: input.id,
          },
          data: {
            isActive: false,
          },
        });

        return service;
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const service = await ctx.db.service.update({
      where: {
        id: input,
      },
      data: {
        isActive: true,
      },
    });
    return service;
  }),

  createCategory: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.serviceCategory.create({
        data: {
          name: input.name,
        },
      });
    }),

  listTags: tenantProcedure.query(async ({ ctx }) => {
    return ctx.db.service
      .findMany({
        select: {
          tags: true,
        },
      })
      .then((services) => {
        return services
          .flatMap((service) => service.tags)
          .filter((tag, index, self) => self.indexOf(tag) === index);
      });
  }),
});
