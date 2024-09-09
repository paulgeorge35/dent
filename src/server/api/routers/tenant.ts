import { EventType, type Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Invitation } from "@/components/emails/invitation";
import { env } from "@/env";
import { resend } from "@/server/resend";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  tenantProcedure,
} from "../trpc";

export const tenantRouter = createTRPCRouter({
  userAlreadyExists: tenantProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tenantId = ctx.session.user.tenantId;
      const profile = await ctx.db.profile.findFirst({
        where: { email: input },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });
      const profileOnTenant = await ctx.db.profile.findFirst({
        where: {
          email: input,
          users: { some: { tenantId } },
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });
      return [!!profileOnTenant, !!profile];
    }),

  accounts: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.email;

    const profile = await ctx.db.profile.findFirst({
      where: { email },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
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
            profile: {
              include: {
                avatar: true,
              },
            },
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
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
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
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
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
      const userId = ctx.session.user.id;
      const tenantId = ctx.session.user.tenantId;

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
          profile: {
            include: {
              avatar: true,
            },
          },
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
        cacheStrategy: {
          ttl: 5,
        },
      });
    }),

  specializations: tenantProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;
    return await ctx.db.specialization.findMany({
      where: { tenantId },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
  }),

  activeUsers: tenantProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;
    return await ctx.db.user.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        profile: {
          include: {
            avatar: {
              select: {
                url: true,
              },
            },
          },
        },
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
  }),

  invitations: adminProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;

    return await ctx.db.invitation.findMany({
      where: {
        expires: { gt: DateTime.now().toJSDate() },
        userId: null,
        invitedBy: {
          tenantId,
          tenant: {
            profile: {
              activeSubscription: true,
            },
          },
        },
      },
      include: {
        invitedBy: true,
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
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
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
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
      const tenantId = ctx.session.user.tenantId;
      const userId = ctx.session.user.id;

      const invitationExists = await ctx.db.invitation.findFirst({
        where: { email: input.email },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (invitationExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invitation.exists",
        });
      }

      const userExists = await ctx.db.user.findFirst({
        where: { profile: { email: input.email }, tenantId },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invitation.user-exists",
        });
      }

      const user = await ctx.db.user.findFirstOrThrow({
        where: { id: userId },
        include: {
          profile: true,
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
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
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
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
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      const activeUsers = await ctx.db.user.findMany({
        where: { tenantId, deletedAt: null },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      const totalUsers = activeInvitations.length + activeUsers.length;

      if (totalUsers >= tenant.profile.plan.maxUsers) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invitation.limit-reached",
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
      const tenantId = ctx.session.user.tenantId;

      const invitation = await ctx.db.invitation.findFirst({
        where: { id: input, invitedBy: { tenantId }, userId: null },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
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
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
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
          invitedBy: {
            tenant: {
              profile: {
                activeSubscription: true,
              },
            },
          },
        },
        include: {
          invitedBy: true,
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
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
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
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
      const tenantId = ctx.session.user.tenantId;

      const user = await ctx.db.user.findFirst({
        where: { id: input, tenantId },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
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
