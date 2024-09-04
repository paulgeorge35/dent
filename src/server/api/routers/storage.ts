import { createTRPCRouter, protectedProcedure, tenantProcedure } from "../trpc";
import { z } from "zod";
import { PutObjectCommand, DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

export const storageRouter = createTRPCRouter({
  avatar: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const avatar = await ctx.db.avatar.findUniqueOrThrow({
        where: { id: input.id },
      });

      return avatar;
    }),

  generateAvatarUploadUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        type: z.union([z.literal("avatar"), z.literal("clinic-logo")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profileId = ctx.session.id;

      const s3 = new S3({
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: env.R2_REGION,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
      });

      const key = `protected/${profileId}/${input.type}/${input.key}`;

      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });

      const file = await ctx.db.avatar.create({
        data: {
          url: new URL(`${env.R2_PUBLIC_URL}/${key}`).toString(),
          key,
        },
      });

      return {
        id: file.id,
        url,
        key,
        previewURL: new URL(`${env.R2_PUBLIC_URL}/${key}`).toString(),
      };
    }),

  deleteAvatar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const avatar = await ctx.db.avatar.findUniqueOrThrow({
        where: { id: input.id },
      });

      await ctx.db.avatar.delete({
        where: {
          id: input.id,
        },
      });

      if (!avatar.key.includes("protected")) return;

      const s3 = new S3({
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: env.R2_REGION,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
      });

      const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: avatar.key,
      });

      await s3.send(command);
    }),

  generateUploadUrl: tenantProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session?.user?.tenantId;
      const userId = ctx.session.user!.id;

      if (!tenantId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const user = await ctx.db.user.findFirst({
        where: { id: userId, tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const s3 = new S3({
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: env.R2_REGION,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
      });

      const key = `${tenantId}/${userId}/${input.key}`;

      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });

      await ctx.db.file.create({
        data: {
          url: new URL(`${env.R2_PUBLIC_URL}/${key}`).toString(),
          key,
          tenantId: tenantId,
          userId,
          size: 0,
          contentType: "",
          extension: "",
          name: "",
          confirmed: false,
        },
      });

      return {
        url,
        key,
        previewURL: new URL(`${env.R2_PUBLIC_URL}/${key}`).toString(),
      };
    }),

  update: tenantProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
        size: z.number(),
        contentType: z.string(),
        extension: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      await ctx.db.file.update({
        where: {
          key: input.key,
          tenantId,
          userId,
        },
        data: {
          name: input.name,
          size: input.size,
          contentType: input.contentType,
          extension: input.extension,
        },
      });
    }),

  delete: tenantProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user!.tenantId;
      const userId = ctx.session.user!.id;

      await ctx.db.file.delete({
        where: {
          key: input.key,
          tenantId,
          userId,
        },
      });

      if (!input.key.includes(userId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const s3 = new S3({
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: env.R2_REGION,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
      });

      const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: input.key,
      });

      await s3.send(command);
    }),
});
