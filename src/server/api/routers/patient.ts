import { z } from "zod";

import { emailSchema } from "@/types/schema";
import { StatusSchema } from "prisma/generated/zod";
import { createTRPCRouter, tenantProcedure } from "../trpc";

export const createInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional(),
  dob: z.date().optional(),
  email: emailSchema.transform((val) => (val === "" ? undefined : val)),
  phone: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  status: StatusSchema.optional().default("ACTIVE"),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
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
    if (orderBy === "name") {
      return `firstName.${order}`;
    }
    if (orderBy === "age") {
      return `dob.${order === "asc" ? "desc" : "asc"}`;
    }
    return str;
  })
  .transform((str) => {
    const [orderBy, order] = str.split(".");
    const validOrderBy = [
      "id",
      "firstName",
      "lastName",
      "dob",
      "email",
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

export const patientRouter = createTRPCRouter({
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
        const userId = ctx.session.user!.id;

        const content = await ctx.db.patient.findMany({
          where: {
            tenantId,
            userId,
            status: "ACTIVE",
            OR: search
              ? [
                  {
                    firstName: { contains: search, mode: "insensitive" },
                  },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ]
              : undefined,
          },
          orderBy: { [orderBy]: order },
          skip: page && per_page ? (page - 1) * per_page : undefined,
          take: per_page,
          cacheStrategy: {
            ttl: 10,
          },
        });

        const count = await ctx.db.patient.count({
          where: {
            tenantId,
            userId,
            status: "ACTIVE",
          },
        });

        return {
          content,
          count,
          pageCount: Math.ceil(count / (per_page ?? 1)),
        };
      },
    ),

  get: tenantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const patient = await ctx.db.patient.findUnique({
        where: { id: input.id },
      });
      return patient;
    }),

  create: tenantProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      const patient = await ctx.db.patient.create({
        data: {
          ...input,
          tenantId,
          userId,
        },
      });

      return patient;
    }),
});
