import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const treatmentRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        name: z.string().trim(),
        description: z
          .string()
          .trim()
          .transform((s) => (s === "" ? null : s))
          .nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.specialization.create({
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
        description: z
          .string()
          .trim()
          .transform((s) => (s === "" ? null : s))
          .nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      return await ctx.db.specialization.update({
        where: { id: input.id, tenantId },
        data: input,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      const specialization = await ctx.db.specialization.findUnique({
        where: { id: input.id, tenantId },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      if (!specialization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Specialization not found",
        });
      }

      if (specialization._count.users > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Specialization has users",
        });
      }

      return await ctx.db.specialization.delete({
        where: { id: input.id, tenantId },
      });
    }),
});
