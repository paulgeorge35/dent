export const dynamic = "force-dynamic";

import { env } from "@/env";
import { db } from "@/server/db";
import { DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";

export async function GET() {
  try {
    const avatars = await db.avatar.findMany({
      where: {
        createdAt: {
          lt: DateTime.now().minus({ minutes: env.R2_FILE_TTL }).toJSDate(),
        },
        profileId: null,
        tenantProfileId: null,
      },
    });

    const s3 = new S3({
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: env.R2_REGION,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    await Promise.all(
      avatars.map(async (file) => {
        const command = new DeleteObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: file.key,
        });
        await s3.send(command);
      }),
    );

    const deletedAvatars = await db.avatar.deleteMany({
      where: {
        createdAt: {
          lt: DateTime.now().minus({ minutes: env.R2_FILE_TTL }).toJSDate(),
        },
        profileId: null,
        tenantProfileId: null,
      },
    });
    console.log(
      `[${DateTime.now().toISO()}] - Deleted ${deletedAvatars.count} expired files`,
    );
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(
      `[${DateTime.now().toISO()}] - Error during cron job:`,
      error,
    );
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
