import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";
import { z } from "zod";

export const treatmentPlanRouter = createTRPCRouter({});
