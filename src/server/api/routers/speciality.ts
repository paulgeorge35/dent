import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";

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
export const specialityRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .merge(pagination)
        .merge(z.object({ sort: sort })),
    )
    .query(
      async ({
        ctx,
        input: {
          search,
          page,
          per_page,
          sort: { order, orderBy },
        },
      }) => {
        const tenantId = ctx.session.user!.tenantId;

        const content = await ctx.db.speciality.findMany({
          where: {
            tenantId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
          include: {
            _count: {
              select: {
                users: true,
              },
            },
          },
        });

        const count = await ctx.db.speciality.count({
          where: {
            tenantId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        });

        return {
          content,
          count,
          pageCount: Math.ceil(count / (per_page ?? 1)),
        };
      },
    ),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().trim(),
        color: z.string().optional(),
        description: z
          .string()
          .trim()
          .transform((s) => (s === "" ? null : s))
          .nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.speciality.create({
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
        name: z.string().trim(),
        color: z.string().optional(),
        description: z
          .string()
          .trim()
          .transform((s) => (s === "" ? null : s))
          .nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.speciality.update({
        where: { id: input.id, tenantId },
        data: input,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      const speciality = await ctx.db.speciality.findUnique({
        where: { id: input.id, tenantId },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (!speciality) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Speciality not found",
        });
      }

      if (speciality._count.users > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Speciality has users",
        });
      }

      return await ctx.db.speciality.delete({
        where: { id: input.id, tenantId },
      });
    }),
});
