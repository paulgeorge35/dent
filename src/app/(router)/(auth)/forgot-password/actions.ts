"use server";

import { generateToken } from "@/auth";
import { PasswordRecovery } from "@/components/emails/password-recovery";
import { env } from "@/env";
import { db } from "@/server/db";
import { resend } from "@/server/resend";

export async function sendResetPasswordEmail(email: string) {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      if (user.banned) {
        throw new Error("Your account has been banned");
      }

      const token = await generateToken(email, "PASSWORD_RESET");

      void resend.emails.send({
        from: "MyDent <hello@mydent.one>",
        to: email,
        subject: "MyDent - Password Recovery",
        react: PasswordRecovery({
          name: user.name,
          url: new URL(`/reset-password?token=${token}`, env.URL).toString(),
        }),
      });
    }
  });
}
