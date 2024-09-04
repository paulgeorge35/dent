import { type UserComplete as zUserComplete } from "@/types/schema";
import { Prisma, type Role, TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { RoleSchema } from "prisma/generated/zod";
import { z } from "zod";
import { DateTime } from "luxon";
import { Confirmation } from "@/components/emails/confirmation";
import { v4 as uuidv4 } from "uuid";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  tenantProcedure,
} from "../trpc";
import { env } from "@/env";
import { resend } from "@/server/resend";

const userComplete = Prisma.validator<Prisma.UserInclude>()({
  profile: {
    include: {
      avatar: true,
    },
  },
});

const pagination = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(10),
});

const sort = z
  .string()
  .default("createdAt.asc")
  .transform((str) => {
    const [orderBy, order] = str.split(".");
    const validOrderBy = ["id", "name", "email", "createdAt", "updatedAt"];
    const validOrder = ["asc", "desc"];

    return {
      orderBy:
        orderBy && validOrderBy.includes(orderBy) ? orderBy : "createdAt",
      order: order && validOrder.includes(order) ? order : "asc",
    };
  });

export type UserComplete = Prisma.UserGetPayload<{
  include: typeof userComplete;
}>;

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.profile.findUnique({
      where: { id: ctx.session.id },
      cacheStrategy: {
        ttl: 10,
      },
    });
    return profile;
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(64),
        confirm: z.string().min(8).max(64),
        firstName: z.string().max(50),
        lastName: z.string().max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, confirm, firstName, lastName } = input;

      const emailExists = await ctx.db.profile.findUnique({
        where: { email },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (emailExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "email.already-exists",
        });
      }

      if (password !== confirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "password.mismatch",
        });
      }

      const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);

      const token = uuidv4();

      await ctx.db.profile.create({
        data: {
          email,
          firstName,
          lastName,
          auth: {
            create: {
              provider: "credentials",
              type: "password",
              passwordHash,
            },
          },
          authTokens: {
            create: {
              type: TokenType.ACTIVATION,
              token,
              expires: DateTime.now().plus({ days: 1 }).toJSDate(),
            },
          },
        },
      });

      void resend.emails.send({
        from: "MyDent <hello@mydent.one>",
        to: email,
        subject: "Confirm your email address",
        react: Confirmation({
          name: `${firstName} ${lastName}`,
          url: `${env.URL}/activate/${token}`,
        }),
      });

      return {
        success: true,
      };
    }),

  confirmAccount: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.db.authToken.findFirst({
        where: { token: input, type: TokenType.ACTIVATION },
        include: { profile: true },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (!token) {
        return {
          success: false,
        };
      }

      await ctx.db.profile.update({
        where: { id: token.profile.id },
        data: { activatedAt: new Date() },
      });

      await ctx.db.authToken.delete({
        where: { id: token.id },
      });

      return {
        success: true,
      };
    }),

  me: tenantProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id;

    const user = (await ctx.db.user.findUnique({
      where: { id: userId },
      include: userComplete,
      cacheStrategy: {
        ttl: 10,
      },
    })) as zUserComplete | null;

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  verifyToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        type: z
          .enum([TokenType.PASSWORD_RESET, TokenType.ACTIVATION])
          .default(TokenType.ACTIVATION),
      }),
    )
    .query(async ({ ctx, input: { token, type } }) => {
      const _token = await ctx.db.token.findFirst({
        where: { token, type },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      });

      if (!_token || _token.expires < new Date()) {
        return false;
      }

      return true;
    }),

  changePassword: protectedProcedure
    .input(
      z
        .object({
          current: z.string(),
          password: z.string(),
          confirm: z.string(),
        })
        .superRefine(({ password, confirm }, ctx) => {
          if (password !== confirm) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "password.mismatch",
              path: ["confirm"],
            });
          }
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { current, password } = input;
      const profileId = ctx.session.id;

      return await ctx.db.$transaction(async (tx) => {
        const auth = await tx.accountAuth.findUnique({
          where: { id: profileId, type: "credentials", provider: "database" },
          include: {
            profile: true,
          },
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        if (!auth) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const passwordMatch = await bcrypt.compare(current, auth.passwordHash!);

        if (!passwordMatch) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Invalid current password",
          });
        }

        if (password === current) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "New password cannot be the same as the current password",
          });
        }

        return await tx.accountAuth.update({
          where: { id: auth.id },
          data: { passwordHash: await bcrypt.hash(password, 10) },
        });
      });
    }),

  getStatus: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = (await ctx.db.user.findUnique({
        where: { id: input },
        select: {
          role: true,
          bannedAt: true,
        },
        cacheStrategy: {
          ttl: env.DEFAULT_TTL,
          swr: env.DEFAULT_SWR,
        },
      })) as zUserComplete | null;

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        isAdmin: user.role === "ADMIN",
        isBanned: user.bannedAt !== null,
      };
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = (await ctx.db.user.findUnique({
      where: { id: input },
      include: userComplete,
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    })) as zUserComplete | null;

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  getAll: tenantProcedure
    .input(
      z
        .object({
          role: z
            .string()
            .optional()
            .transform(
              (val) =>
                val
                  ?.split(".")
                  .filter((role) =>
                    Object.values(RoleSchema.Values).includes(role as Role),
                  ) as Role[],
            ),
          specialization: z
            .string()
            .optional()
            .transform((val) => {
              return val
                ?.split(".")
                .map((specialization) => specialization.trim());
            }),
          search: z.string().optional(),
        })
        .merge(pagination)
        .merge(z.object({ sort: sort })),
    )
    .query(
      async ({
        ctx,
        input: {
          role,
          specialization,
          search,
          page,
          per_page,
          sort: { order, orderBy },
        },
      }) => {
        const tenantId = ctx.session.user!.tenantId;

        const content = await ctx.db.user.findMany({
          where: {
            role: role ? { in: role } : undefined,
            specializationId: specialization
              ? { in: specialization }
              : undefined,
            tenantId,
            OR: [
              { profile: { email: { contains: search, mode: "insensitive" } } },
            ],
          },
          include: {
            profile: true,
            specialization: true,
          },
          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        const count = await ctx.db.user.count({
          where: {
            role: role ? { in: role } : undefined,
            OR: [
              { profile: { email: { contains: search, mode: "insensitive" } } },
            ],
          },
        });

        return {
          content,
          count,
          pageCount: Math.ceil(count / (per_page ?? 1)),
        };
      },
    ),

  update: tenantProcedure
    .input(
      z.object({
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        title: z.string().max(50).optional(),
        specializationId: z.string().optional(),
        email: z.string().email().max(50).optional(),
        phone: z
          .string()
          .max(20)
          .optional()
          .nullable()
          .transform((v) => {
            if (v && v.length <= 3) return null;
            return v;
          }),
        bio: z.string().max(500).optional(),
        avatarId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id;

      if (input.avatarId === null) {
        await ctx.db.avatar.updateMany({
          where: {
            profile: {
              users: { some: { id: userId } },
            },
          },
          data: {
            profileId: null,
          },
        });
      }

      const user = await ctx.db.user.update({
        where: { id: userId },
        data: {
          specialization: {
            connect: {
              id: input.specializationId,
            },
          },
          profile: {
            update: {
              email: input.email,
              phone: input.phone,
              title: input.title,
              firstName: input.firstName,
              lastName: input.lastName,
              avatar: input.avatarId
                ? {
                    connect: {
                      id: input.avatarId,
                    },
                  }
                : undefined,
            },
          },
        },
        include: {
          profile: {
            include: {
              avatar: true,
            },
          },
        },
      });
      return user;
    }),

  toggleBan: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const targetUser = await tx.user.findUnique({
          where: { id: input },
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
        });

        if (!targetUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return await tx.user.update({
          where: { id: input },
          data: {
            bannedAt: targetUser.bannedAt ? null : new Date(),
          },
        });
      });
    }),

  invitations: protectedProcedure.query(async ({ ctx }) => {
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

    const now = DateTime.now().toJSDate();

    return await ctx.db.invitation.findMany({
      where: {
        expires: { gt: now },
        email,
        userId: null,
      },
      select: {
        token: true,
        invitedBy: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
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
        },
      },
      cacheStrategy: {
        ttl: env.DEFAULT_TTL,
        swr: env.DEFAULT_SWR,
      },
    });
  }),
});
