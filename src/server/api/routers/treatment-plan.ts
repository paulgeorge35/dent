import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, tenantProcedure } from "../trpc";

export const treatmentPlanRouter = createTRPCRouter({});
