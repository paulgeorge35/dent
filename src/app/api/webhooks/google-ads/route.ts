import { NewPatient } from "@/components/emails/new-patient";
import { env } from "@/env";
import { db } from "@/server/db";
import { resend } from "@/server/resend";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  lead_id: z.string(),
  user_column_data: z
    .array(
      z.object({
        column_name: z.string(),
        string_value: z.string(),
        column_id: z.string(),
      }),
    )
    .refine(
      (data) => {
        const requiredColumnIds = ["FULL_NAME", "PHONE_NUMBER", "CITY"];
        return requiredColumnIds.every((id) =>
          data.some((item) => item.column_id === id),
        );
      },
      {
        message:
          "user_column_data must contain at least FULL_NAME, PHONE_NUMBER, and CITY column_ids",
      },
    ),
  api_version: z.string(),
  form_id: z.number(),
  campaign_id: z.number(),
  google_key: z.string(),
  is_test: z.boolean(),
  gcl_id: z.string(),
  adgroup_id: z.number(),
  creative_id: z.number(),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const payload = await request.json();

    const parsedPayload = schema.parse(payload);

    const user = await db.user.findFirst({
      where: {
        webhookApiKey: parsedPayload.google_key,
      },
      include: {
        profile: true,
        tenant: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 },
      );
    }

    const fullName = parsedPayload.user_column_data.find(
      (column) => column.column_id === "FULL_NAME",
    )!.string_value;

    const [firstName, lastName] = fullName.split(" ");

    const phoneNumber = parsedPayload.user_column_data.find(
      (column) => column.column_id === "PHONE_NUMBER",
    )!.string_value;

    const city = parsedPayload.user_column_data.find(
      (column) => column.column_id === "CITY",
    )!.string_value;

    const patient = await db.patient.create({
      data: {
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        phone: phoneNumber,
        city,
        user: {
          connect: {
            id: user.id,
          },
        },
        tenant: {
          connect: {
            id: user.tenantId,
          },
        },
      },
    });

    void resend.emails.send({
      from: "MyDent <hello@mydent.one>",
      to: user.profile.email,
      subject: "MyDent - New patient registered",
      react: NewPatient({
        name: user.profile.firstName,
        url: `${env.URL}/patient/${patient.id}`,
        clinicName: user.tenant.profile.name,
        source: "Google Ads",
      }),
    });

    return NextResponse.json(
      { success: true, message: "Lead data processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
}
