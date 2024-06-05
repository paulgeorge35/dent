import { type UserComplete as zUserComplete } from "@/types/schema";
import { Prisma, type Role, TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { RoleSchema } from "prisma/generated/zod";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  memberProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const userComplete = Prisma.validator<Prisma.UserInclude>()({
  profile: true,
});

const userHasAll = Prisma.validator<Prisma.UserWhereInput>()({
  profile: { isNot: null },
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
  me: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = (await ctx.db.user.findUnique({
      where: { id: userId, ...userHasAll },
      include: userComplete,
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
              message: "Passwords do not match",
              path: ["confirm"],
            });
          }
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { current, password } = input;
      const userId = ctx.session.user.id;

      return await ctx.db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const passwordMatch =
          user.passwordHash &&
          (await bcrypt.compare(current, user.passwordHash));

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

        return await tx.user.update({
          where: { id: userId },
          data: {
            passwordHash: await bcrypt.hash(password, 10),
          },
        });
      });
    }),

  getStatus: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = (await ctx.db.user.findUnique({
        where: { id: input, ...userHasAll },
        select: {
          role: true,
          banned: true,
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
        isBanned: user.banned,
      };
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = (await ctx.db.user.findUnique({
      where: { id: input, ...userHasAll },
      include: userComplete,
    })) as zUserComplete | null;

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  getAll: memberProcedure
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
          search,
          page,
          per_page,
          sort: { order, orderBy },
        },
      }) => {
        const content = (await ctx.db.user.findMany({
          where: {
            role: role ? { in: role } : undefined,
            ...userHasAll,
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          },
          include: userComplete,
          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
        })) as zUserComplete[];

        const count = await ctx.db.user.count({
          where: {
            role: role ? { in: role } : undefined,
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
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

  update: protectedProcedure
    .input(
      z.object({
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        county: z.string().max(50).optional(),
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
        avatar: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.db.user.update({
        where: { id: userId },
        data: {
          name: `${input.firstName} ${input.lastName}`,
          email: input.email,
          phone: input.phone,
          profile: {
            update: {
              avatar: input.avatar,
              firstName: input.firstName,
              lastName: input.lastName,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return user;
    }),

  updateAvatar: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.db.user.update({
        where: { id: userId },
        data: {
          profile: {
            update: {
              avatar: input,
            },
          },
        },
      });
    }),

  removeAvatar: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.db.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            avatar: null,
          },
        },
      },
    });
  }),

  toggleBan: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const targetUser = await tx.user.findUnique({
          where: { id: input },
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
            banned: !targetUser.banned,
          },
        });
      });
    }),
});
