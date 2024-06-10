import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const appointments = await ctx.db.event.findMany({
      where: {
        patient: {
          userId,
        },
      },
      include: {
        patient: true,
        proposedTimes: {
          select: {
            start: true,
            end: true,
            notified: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return appointments
      .filter((appointment) => appointment.patient !== null)
      .map((appointment) => ({
        ...appointment,
        patient: appointment.patient!,
        ...appointment.proposedTimes[0]!,
      }));
  }),

  create: protectedProcedure
    .input(appointmentCreateInput)
    .mutation(
      async ({
        ctx,
        input: { patient, title, allDay, description, date, ...input },
      }) => {
        const userId = ctx.session.user.id;

        await ctx.db.$transaction(async (tx) => {
          return await tx.event.create({
            data: {
              title,
              description,
              date,
              allDay,
              ...input,
              proposedTimes: {
                create: {
                  date,
                  ...input,
                },
              },
              patient: {
                connect: "id" in patient ? { id: patient.id } : undefined,
                create:
                  "id" in patient
                    ? undefined
                    : {
                        ...patient,
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
      const userId = ctx.session.user.id;

      return await ctx.db.$transaction(async (tx) => {
        const appointment = await tx.event.findFirst({
          where: { id: input.id },
          include: {
            proposedTimes: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        if (!appointment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        const originalTime = appointment.proposedTimes[0];

        const isReschedule =
          originalTime &&
          (originalTime.start !== input.start ||
            // originalTime.end !== input.end ||
            originalTime.date !== input.date);

        if (isReschedule)
          await tx.proposedTime.update({
            where: { id: originalTime.id },
            data: {
              status: "RESCHEDULED",
            },
          });

        return await tx.event.update({
          where: {
            id: input.id,
            patient: {
              userId,
            },
          },
          data: {
            allDay: input.allDay,
            date: input.date,
            start: input.start,
            end: input.end,
            description: input.description,
            status: isReschedule ? "CREATED" : undefined,
            proposedTimes: isReschedule
              ? {
                  create: {
                    date: input.date,
                    start: input.start,
                    end: input.end,
                  },
                }
              : undefined,
          },
        });
      });
    }),
});
