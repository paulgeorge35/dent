import { SupportTicket } from "@/components/emails/support-ticket";
import { resend } from "@/server/resend";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, tenantProcedure } from "../trpc";

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

  submitSupportTicket: tenantProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const tenantId = ctx.session.user.tenantId;

      const user = await ctx.db.user.findUnique({
        where: { id: userId, tenantId },
        select: {
          id: true,
          role: true,
          tenant: {
            select: {
              profile: {
                select: {
                  name: true,
                  phone: true,
                  plan: {
                    select: {
                      name: true,
                    },
                  },
                  createdAt: true,
                },
              },
            },
          },
          profile: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!user) return;

      await resend.emails.send({
        from: "MyDent <hello@mydent.one>",
        to: "paultibulca@gmail.com",
        cc: user.profile.email,
        subject: "MyDent - New Support Ticket",
        react: SupportTicket({
          user: {
            ...user,
            role: user.role.toString(),
          },
          title: input.title,
          description: input.description,
        }),
      });
    }),
});
