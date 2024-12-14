import { z } from "zod";

import { emailSchema } from "@/types/schema";
import { TRPCError } from "@trpc/server";
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
  note: z.string().optional(),
});

export const updateInput = createInput
  .partial()
  .merge(z.object({ id: z.string() }));

const medicalDataSchema = z.object({
  allergies: z.string().nullish(),
  medications: z.string().nullish(),
  conditions: z.string().nullish(),
});

const oralCheckSchema = z.object({
  occlusion: z.string().nullish(),
  parodontosis: z.string().nullish(),
  toothDecay: z.string().nullish(),
  toothDiscoloration: z.string().nullish(),
});

const medicalSchema = medicalDataSchema.merge(oralCheckSchema);

export const updateMedicalInput = z.object({
  id: z.string(),
  medical: medicalSchema.optional(),
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
          search: z.string().optional().transform((val) => val?.trim()?.toLowerCase()),
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
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["0"],
                      string_contains: word,
                    },
                  })),
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["1"],
                      string_contains: word,
                    },
                  })),
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["2"],
                      string_contains: word,
                    },
                  })),
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["3"],
                      string_contains: word,
                    },
                  })),
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["4"],
                      string_contains: word,
                    },
                  })),
                  ...search.split(" ").map((word) => ({
                    filters: {
                      path: ["5"],
                      string_contains: word,
                    },
                  })),
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
        include: {
          data: true,
        },
      });

      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });
      }

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

  update: tenantProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      const patient = await ctx.db.patient.findUnique({
        where: { id: input.id, tenantId, userId },
      });

      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });
      }

      const updatedPatient = await ctx.db.patient.update({
        where: { id: input.id, tenantId, userId },
        data: input,
      });

      return updatedPatient;
    }),

  updateMedical: tenantProcedure
    .input(updateMedicalInput)
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      const patient = await ctx.db.patient.findUnique({
        where: { id: input.id, tenantId, userId },
      });

      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });
      }

      const updatedPatient = await ctx.db.patient.update({
        where: { id: input.id, tenantId, userId },
        data: input,
      });

      return updatedPatient;
    }),
});
