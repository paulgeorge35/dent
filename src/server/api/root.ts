import { utilsRouter } from "./routers/utils";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { appointmentRouter } from "./routers/appointment";
import { tenantRouter } from "./routers/tenant";
import { stripeRouter } from "./routers/stripe";
import { specializationRouter } from "./routers/specialization";
import { serviceRouter } from "./routers/service";
import { materialRouter } from "./routers/material";
import { treatmentRouter } from "./routers/treatment";
import { treatmentPlanRouter } from "./routers/treatment-plan";
import { patientRouter } from "./routers/patient";
import { storageRouter } from "./routers/storage";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  utils: utilsRouter,
  tenant: tenantRouter,
  stripe: stripeRouter,
  specialization: specializationRouter,
  appointment: appointmentRouter,
  service: serviceRouter,
  material: materialRouter,
  treatment: treatmentRouter,
  treatmentPlan: treatmentPlanRouter,
  patient: patientRouter,
  storage: storageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
