import { db } from "@/server/db";
import { env } from "@/env";
import { DateTime } from "luxon";

export async function GET() {
  try {
    console.log(`[${DateTime.now().toISO()}] - Starting cron job`);
    const deletedAttachments = await db.attachment.deleteMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: DateTime.now().minus({ minutes: env.R2_FILE_TTL }).toJSDate(),
        },
      },
    });
    console.log(
      `[${DateTime.now().toISO()}] - Deleted ${deletedAttachments.count} expired attachments`,
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
