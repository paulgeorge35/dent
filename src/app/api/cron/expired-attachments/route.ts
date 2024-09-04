export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { env } from "@/env";
import { DateTime } from "luxon";
import { DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const files = await db.file.findMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: DateTime.now().minus({ minutes: env.R2_FILE_TTL }).toJSDate(),
        },
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
      files.map(async (file) => {
        const command = new DeleteObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: file.key,
        });
        await s3.send(command);
      }),
    );

    const deletedAttachments = await db.file.deleteMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: DateTime.now().minus({ minutes: env.R2_FILE_TTL }).toJSDate(),
        },
      },
    });
    console.log(
      `[${DateTime.now().toISO()}] - Deleted ${deletedAttachments.count} expired files`,
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
