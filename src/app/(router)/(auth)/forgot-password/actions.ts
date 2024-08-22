"use server";

import { generateToken } from "@/auth";
import { PasswordRecovery } from "@/components/emails/password-recovery";
import { env } from "@/env";
import { db } from "@/server/db";
import { resend } from "@/server/resend";

export async function sendResetPasswordEmail(email: string) {
  await db.$transaction(async (tx) => {
    const profile = await tx.profile.findFirst({
      where: { email },
      include: {
        users: {
          include: { tenant: true },
        },
      },
    });

    if (!profile) return;

    const activeUser = profile.users.find(
      (user) => !user.deletedAt && !user.bannedAt,
    );

    if (!activeUser) return;

    const token = await generateToken({
      tenantId: activeUser.tenantId,
      email,
      type: "PASSWORD_RESET",
    });

    void resend.emails.send({
      from: "MyDent <hello@mydent.one>",
      to: email,
      subject: "MyDent - Password Recovery",
      react: PasswordRecovery({
        name: `${profile.firstName} ${profile.lastName}`,
        url: new URL(`/reset-password?token=${token}`, env.URL).toString(),
      }),
    });
  });
}
