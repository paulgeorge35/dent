import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

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
