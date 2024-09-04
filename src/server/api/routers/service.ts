import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";
import { z } from "zod";
import { ServiceUnitSchema } from "prisma/generated/zod";
import type { Prisma } from "@prisma/client";
import { env } from "@/env";

const createMaterialSchema = z.object({
  quantity: z.number(),
  unit_price: z.number(),
  materialId: z.string(),
});

const createRelatedServiceSchema = z.object({
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

const updateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  unit_price: z.number(),
  unit: ServiceUnitSchema,
  duration: z.number().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  isActive: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  materials: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
      }),
    )
    .optional(),
  relatedServices: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
        serviceId: z.string(),
      }),
    )
    .optional(),
});

export const serviceRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      z.object({
        type: z.enum(["SINGLE", "MULTI"]).optional().default("SINGLE"),
      }),
    )
    .query(async ({ ctx, input: { type } }) => {
      const tenantId = ctx.session.user!.tenantId;

      const services = await ctx.db.service.findMany({
        where: {
          tenantId,
          ...(type === "SINGLE" && {
            children: {
              none: {},
            },
          }),
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });
      return services;
    }),

  get: tenantProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const service = await ctx.db.service.findUnique({
      where: {
        id: input,
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
      return service;
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, materials, relatedServices, ...data } = input;
      const tenantId = ctx.session.user!.tenantId;

      const serviceUpdateData = {
        ...data,
        tenantId,
      };

      return await ctx.db.$transaction(async (tx) => {
        if (materials) {
          for (const material of materials) {
            await tx.service.update({
              where: { id },
              data: {
                materials: {
                  updateMany: {
                    where: { id: material.id },
                    data: {
                      quantity: material.quantity,
                      unit_price: material.unit_price,
                    },
                  },
                },
              },
            });
          }
        }

        if (relatedServices) {
          for (const relatedService of relatedServices) {
            await tx.service.update({
              where: { id },
              data: {
                children: {
                  updateMany: {
                    where: { id: relatedService.id },
                    data: {
                      quantity: relatedService.quantity,
                      unit_price: relatedService.unit_price,
                      service: { connect: { id: relatedService.serviceId } },
                    },
                  },
                },
              },
            });
          }
        }

        return await tx.service.update({
          where: { id },
          data: serviceUpdateData,
        });
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
});
