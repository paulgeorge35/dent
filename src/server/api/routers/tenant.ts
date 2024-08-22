import { EventType, type Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  tenantProcedure,
} from "../trpc";
import { DateTime } from "luxon";
import { env } from "@/env";
import { v4 as uuidv4 } from "uuid";
import { resend } from "@/server/resend";
import { Invitation } from "@/components/emails/invitation";

export const tenantRouter = createTRPCRouter({
  userAlreadyExists: tenantProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const profile = await ctx.db.profile.findFirst({
        where: { email: input },
      });
      const profileOnTenant = await ctx.db.profile.findFirst({
        where: {
          email: input,
          users: { some: { tenantId } },
        },
      });
      return [profileOnTenant ? true : false, profile ? true : false];
    }),

  accounts: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.email;

    const profile = await ctx.db.profile.findFirst({
      where: { email },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return await ctx.db.user.findMany({
      where: { profileId: profile.id, deletedAt: null },
      include: {
        tenant: {
          include: {
            profile: true,
            users: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }),

  currentTenant: tenantProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.tenantId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const tenant = await ctx.db.tenant.findUnique({
      where: { id: ctx.session.user?.tenantId },
      include: {
        profile: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
    }

    return tenant;
  }),

  calendar: tenantProcedure
    .input(
      z.object({
        selected: z.union([z.string(), z.literal("all"), z.literal("me")]),
        dateRange: z
          .object({
            start: z.date(),
            end: z.date(),
          })
          .nullable(),
      }),
    )
    .query(async ({ ctx, input: { selected, dateRange } }) => {
      const userId = ctx.session.user!.id;
      const tenantId = ctx.session.user!.tenantId;

      const where: Prisma.UserWhereInput = {
        tenantId,
        deletedAt: null,
        bannedAt: null,
        id:
          selected === "all"
            ? undefined
            : selected === "me"
              ? userId
              : selected,
      };

      return await ctx.db.user.findMany({
        where,
        include: {
          profile: true,
          events: {
            where: {
              type: EventType.APPOINTMENT,
              date: {
                gte: dateRange?.start,
                lte: dateRange?.end,
              },
            },
            include: {
              patient: true,
            },
          },
        },
      });
    }),

  specializations: tenantProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user!.tenantId;
    return await ctx.db.specialization.findMany({
      where: { tenantId },
    });
  }),

  activeUsers: tenantProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user!.tenantId;
    return await ctx.db.user.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        profile: true,
      },
    });
  }),

  invitations: adminProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user!.tenantId;

    return await ctx.db.invitation.findMany({
      where: {
        invitedBy: { tenantId },
        expires: { gt: DateTime.now().toJSDate() },
      },
      include: {
        invitedBy: true,
      },
    });
  }),

  invitation: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: { token: input, expires: { gt: DateTime.now().toJSDate() } },
        select: {
          id: true,
          email: true,
          invitedBy: {
            select: {
              profile: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
              tenant: {
                select: {
                  profile: {
                    select: {
                      name: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      return invitation;
    }),

  invite: adminProcedure
    .input(
      z.object({
        email: z.string(),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      const invitationExists = await ctx.db.invitation.findFirst({
        where: { email: input.email },
      });

      if (invitationExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation already exists",
        });
      }

      const userExists = await ctx.db.user.findFirst({
        where: { profile: { email: input.email }, tenantId },
      });

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const user = await ctx.db.user.findFirstOrThrow({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      const tenant = await ctx.db.tenant.findFirstOrThrow({
        where: { id: tenantId },
        include: {
          profile: {
            include: {
              plan: true,
            },
          },
        },
      });

      const activeInvitations = await ctx.db.invitation.findMany({
        where: {
          invitedBy: { tenantId },
          expires: { gt: DateTime.now().toJSDate() },
        },
        include: {
          invitedBy: true,
        },
      });

      const activeUsers = await ctx.db.user.findMany({
        where: { tenantId, deletedAt: null },
      });

      const totalUsers = activeInvitations.length + activeUsers.length;

      if (totalUsers >= tenant.profile.plan.maxUsers) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum users reached",
        });
      }

      const token = uuidv4();

      const invitation = await ctx.db.invitation.create({
        data: {
          email: input.email,
          role: input.role,
          token,
          expires: DateTime.now().plus({ days: 3 }).toJSDate(),
          invitedBy: { connect: { id: userId } },
        },
      });

      await resend.emails.send({
        from: "MyDent <hello@mydent.one>",
        to: [input.email],
        subject: "MyDent - Invitation to join clinic",
        react: Invitation({
          url: `${env.URL}/invite/${token}`,
          tenantName: tenant.profile.name,
          name: user.profile.firstName,
        }),
      });

      return invitation;
    }),

  deleteInvitation: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      const invitation = await ctx.db.invitation.findFirst({
        where: { id: input, invitedBy: { tenantId }, userId: null },
      });

      if (!invitation) return;

      return await ctx.db.invitation.delete({
        where: { id: invitation.id },
      });
    }),

  join: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.profile.findFirst({
        where: { email: ctx.session.email },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      const invitation = await ctx.db.invitation.findFirst({
        where: {
          token: input,
          email: ctx.session.email,
          userId: null,
          expires: { gt: DateTime.now().toJSDate() },
        },
        include: {
          invitedBy: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      await ctx.db.invitation.update({
        where: { id: invitation.id },
        data: {
          user: {
            create: {
              profileId: profile.id,
              role: invitation.role,
              tenantId: invitation.invitedBy.tenantId,
              activatedAt: DateTime.now().toJSDate(),
            },
          },
        },
      });
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          role: input.role,
        },
      });
    }),

  deleteUser: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;

      const user = await ctx.db.user.findFirst({
        where: { id: input, tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return await ctx.db.user.update({
        where: { id: user.id },
        data: {
          deletedAt: DateTime.now().toJSDate(),
        },
      });
    }),
});
