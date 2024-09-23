import { z } from "zod";

import { env } from "@/env";
import quizJsonSchema from "@/lib/quiz-questions.json";
import type { EventChangeAction } from "@/types";
import { appointmentCreateInput } from "@/types/schema";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { createTRPCRouter, tenantProcedure } from "../trpc";

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
        input: {
          patient: patientInput,
          serviceId,
          quiz,
          files,
          userId: resourceId,
          ...input
        },
      }) => {
        const userId = ctx.session.user.id;
        const tenantId = ctx.session.user.tenantId;

        const patientId = await ctx.db.$transaction(async (tx) => {
          if (patientInput === undefined) return undefined;

          if ("id" in patientInput) {
            return patientInput.id;
          }

          const patient = await tx.patient.create({
            data: {
              ...patientInput,
              tenantId,
              userId: resourceId ?? userId,
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
              userId: resourceId ?? userId,
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
      const userId = ctx.session.user.id;

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

  confirm: tenantProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.db.event.update({
        where: { id: input, userId },
        data: { status: "CONFIRMED" },
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

  addDayOff: tenantProcedure
    .input(z.object({ title: z.string(), start: z.date(), end: z.date() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const tenantId = ctx.session.user.tenantId;

      return await ctx.db.event.create({
        data: {
          ...input,
          date: input.start,
          type: "DAY_OFF",
          allDay: true,
          initiator: "USER",
          tenantId,
          userId,
        },
      });
    }),

  updateDayOff: tenantProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.db.event.update({
        where: { id: input.id, userId, type: "DAY_OFF" },
        data: {
          ...input,
          date: input.start,
        },
      });
    }),

  removeDayOff: tenantProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.db.event.delete({
        where: { id: input, userId, type: "DAY_OFF" },
      });
    }),

  getDayOffs: tenantProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.db.event.findMany({
      where: { userId, type: "DAY_OFF" },
    });
  }),

  stats: tenantProcedure
    .input(z.enum(["currentMonth", "lastWeek", "currentWeek", "today"]))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const now = DateTime.now();
      const startDate = (() => {
        switch (input) {
          case "currentMonth":
            return now.startOf("month");
          case "lastWeek":
            return now.minus({ weeks: 1 }).startOf("week");
          case "currentWeek":
            return now.startOf("week");
          case "today":
            return now.startOf("day");
          default:
            return now.startOf("day");
        }
      })();
      const endDate = (() => {
        switch (input) {
          case "currentMonth":
            return now;
          case "lastWeek":
            return now.minus({ weeks: 1 }).endOf("week");
          case "currentWeek":
            return now.endOf("week");
          case "today":
            return now;
          default:
            return now;
        }
      })();

      const appointments = await ctx.db.event.groupBy({
        by: ["date"],
        where: {
          userId,
          type: "APPOINTMENT",
          date: {
            gte: startDate.toJSDate(),
            lt: endDate.toJSDate(),
          },
        },
        _count: {
          id: true,
        },
        cacheStrategy: {
          ttl: 30,
          swr: 30,
        },
      });

      const dailyCounts = [];
      let currentDate = startDate;
      while (currentDate <= endDate) {
        const appointmentForDay = appointments.find(
          (a) =>
            a.date.toDateString() === currentDate.toJSDate().toDateString(),
        );
        dailyCounts.push({
          date: currentDate.toJSDate(),
          count: appointmentForDay ? appointmentForDay._count.id : 0,
        });
        currentDate = currentDate.plus({ days: 1 });
      }

      return {
        period: input,
        dailyStats: dailyCounts,
        startDate: startDate.toJSDate(),
        endDate: endDate.toJSDate(),
        total: appointments.reduce((acc, curr) => acc + curr._count.id, 0),
      };
    }),

  commonTreatments: tenantProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const services = await ctx.db.service.findMany({
      where: {
        visits: {
          every: {
            event: {
              userId,
              type: "APPOINTMENT",
            },
          },
        },
      },
      include: {
        visits: true,
      },
      cacheStrategy: {
        swr: 60 * 60 * 24,
      },
    });

    return services
      .map((service) => ({
        name: service.name,
        count: service.visits.length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }),

  today: tenantProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.db.event
      .findMany({
        where: {
          userId,
          type: "APPOINTMENT",
          status: {
            not: "CANCELLED",
          },
          start: {
            gte: DateTime.now().startOf("day").toJSDate(),
            lt: DateTime.now().endOf("day").toJSDate(),
          },
        },
        include: {
          patient: true,
          visits: {
            include: {
              service: true,
            },
          },
        },
        cacheStrategy: {
          ttl: 30,
          swr: 30,
        },
      })
      .then((appointments) => {
        return appointments.map((appointment) => {
          return {
            id: appointment.id,
            date: appointment.start,
            patient: `${appointment.patient!.firstName} ${appointment.patient!.lastName}`,
            service: appointment.visits[0]?.service?.name,
            duration: appointment.visits[0]?.service?.duration,
          };
        });
      });
  }),
});
