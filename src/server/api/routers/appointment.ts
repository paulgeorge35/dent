import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type EventChangeAction } from "@/types";
import { type Prisma } from "@prisma/client";
import { EventTypeSchema } from "prisma/generated/zod";

const patientCreateInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  county: z.string().nullish(),
  zipCode: z.string().nullish(),
  smsNotifications: z.boolean().default(false),
  emailNotifications: z.boolean().default(false),
});

const appointmentCreateInput = z.object({
  title: z.string().default("Appointment"),
  description: z.string().nullish(),
  date: z.date(),
  allDay: z.boolean().default(false),
  start: z.date().nullish(),
  end: z.date().nullish(),
  patient: z.union([
    z.object({
      id: z.string(),
    }),
    patientCreateInput,
  ]),
});

const appointmentUpdateInput = z.object({
  id: z.string(),
  description: z.string().nullish(),
  date: z.date(),
  allDay: z.boolean().default(false),
  start: z.date().nullish(),
  end: z.date().nullish(),
});

export const appointmentRouter = createTRPCRouter({
  myEvents: protectedProcedure
    .input(
      z.object({
        type: EventTypeSchema.optional().default("APPOINTMENT"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id;

      const appointments = await ctx.db.event.findMany({
        where: {
          userId,
          type: input.type,
        },
        include: {
          patient: true,
        },
      });

      return appointments;
    }),

  create: protectedProcedure
    .input(appointmentCreateInput)
    .mutation(
      async ({
        ctx,
        input: { patient, title, allDay, description, date, ...input },
      }) => {
        const userId = ctx.session.user!.id;
        const tenantId = ctx.session.user!.tenantId;

        await ctx.db.$transaction(async (tx) => {
          return await tx.event.create({
            data: {
              title,
              description,
              date,
              allDay,
              user: { connect: { id: userId } },
              tenant: { connect: { id: tenantId } },
              ...input,
              patient: {
                connect: "id" in patient ? { id: patient.id } : undefined,
                create:
                  "id" in patient
                    ? undefined
                    : {
                        ...patient,
                        tenantId,
                        userId,
                      },
              },
            },
          });
        });
      },
    ),

  update: protectedProcedure
    .input(appointmentUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id;

      return await ctx.db.$transaction(async (tx) => {
        const { id, date, description, start, end, allDay } = input;
        const changes: EventChangeAction[] = [];

        const appointment = await tx.event.findFirst({
          where: { id: id },
        });

        if (!appointment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        if (date && date !== appointment.date) {
          changes.push({
            type: "date",
            from: appointment.date,
            to: date,
          });
        }

        if (description && description !== appointment.description) {
          changes.push({
            type: "description",
            from: appointment.description,
            to: description,
          });
        }

        if (start && start !== appointment.start) {
          changes.push({
            type: "start",
            from: appointment.start,
            to: start,
          });
        }

        if (end && end !== appointment.end) {
          changes.push({
            type: "end",
            from: appointment.end,
            to: end,
          });
        }

        if (allDay && allDay !== appointment.allDay) {
          changes.push({
            type: "allDay",
            from: appointment.allDay,
            to: allDay,
          });
        }

        const isReschedule =
          changes.some((change) => change.type === "date") ||
          changes.some((change) => change.type === "start");

        return await tx.event.update({
          where: {
            id,
            userId,
          },
          data: {
            allDay,
            date,
            start,
            end,
            description,
            status: isReschedule ? "CREATED" : undefined,
            actions: {
              create: {
                data: changes as Prisma.JsonArray,
                userId,
              },
            },
          },
        });
      });
    }),
});
