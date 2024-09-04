import { z } from "zod";

import { createTRPCRouter, tenantProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type EventChangeAction } from "@/types";
import { type Prisma } from "@prisma/client";
import quizJsonSchema from "@/lib/quiz-questions.json";
import { appointmentCreateInput } from "@/types/schema";
import { env } from "@/env";

const appointmentUpdateInput = z.object({
  id: z.string(),
  description: z.string().nullish(),
  date: z.date(),
  allDay: z.boolean().default(false),
  start: z.date().nullish(),
  end: z.date().nullish(),
});

export const appointmentRouter = createTRPCRouter({
  get: tenantProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const event = await ctx.db.event.findUnique({
      where: { id: input },
      include: {
        patient: true,
        visits: {
          include: {
            service: true,
          },
        },
        user: {
          select: {
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      cacheStrategy: {
        ttl: 5,
      },
    });

    return event;
  }),
  create: tenantProcedure
    .input(appointmentCreateInput)
    .mutation(
      async ({
        ctx,
        input: { patient: patientInput, serviceId, quiz, files, ...input },
      }) => {
        const userId = ctx.session.user!.id;
        const tenantId = ctx.session.user!.tenantId;

        const patientId = await ctx.db.$transaction(async (tx) => {
          if (patientInput === undefined) return undefined;

          if ("id" in patientInput) {
            return patientInput.id;
          }

          const patient = await tx.patient.create({
            data: {
              ...patientInput,
              tenantId,
              userId,
            },
          });

          return patient.id;
        });

        return await ctx.db.$transaction(async (tx) => {
          const service = await tx.service.findUnique({
            where: { id: serviceId },
            cacheStrategy: {
              ttl: env.DEFAULT_TTL,
              swr: env.DEFAULT_SWR,
            },
          });

          if (!service) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Service not found",
            });
          }

          const treatment = await tx.treatment.create({
            data: {
              price: service.unit_price,
            },
          });

          const event = await tx.event.create({
            data: {
              ...input,
              userId,
              tenantId,
              patientId,
              initiator: "USER",
              visits: {
                create: {
                  serviceId: service.id,
                  treatmentId: treatment.id,
                },
              },
              quiz: quiz
                ? {
                    create: {
                      quiz: quizJsonSchema as unknown as Prisma.JsonObject,
                      answers: quiz?.answers,
                      patient: {
                        connect: {
                          id: patientId,
                        },
                      },
                    },
                  }
                : undefined,
            },
          });

          if (files) {
            await tx.file.updateMany({
              where: {
                key: {
                  in: files.map((file) => file.key),
                },
              },
              data: {
                eventId: event.id,
                tenantId,
                userId,
                patientId,
                confirmed: true,
              },
            });
          }

          return event;
        });
      },
    ),

  update: tenantProcedure
    .input(appointmentUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id;

      return await ctx.db.$transaction(async (tx) => {
        const { id, date, description, start, end, allDay } = input;
        const changes: EventChangeAction[] = [];

        const appointment = await tx.event.findFirst({
          where: { id: id },
          cacheStrategy: {
            ttl: env.DEFAULT_TTL,
            swr: env.DEFAULT_SWR,
          },
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

  count: tenantProcedure
    .input(
      z.object({
        date: z.date(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { date, userId } = input;

      const count = await ctx.db.event.count({
        where: {
          type: "APPOINTMENT",
          status: "CONFIRMED",
          patientId: {
            not: null,
          },
          date: {
            equals: date,
          },
          userId,
        },
      });

      return count;
    }),
});
