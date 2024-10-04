"use server";

import { consumeToken } from "@/auth";
import { PasswordChanged } from "@/components/emails/password-changed";
import { db } from "@/server/db";
import { resend } from "@/server/resend";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function updatePassword(token: string, password: string) {
  const user = await consumeToken(token, "PASSWORD_RESET");

  const profile = await db.profile.findFirst({
    where: { email: user.email },
  });

  if (!profile) return;

  const auth = await db.account.findFirst({
    where: {
      profileId: profile.id,
      type: "password",
      provider: "credentials",
    },
  });

  if (!auth) return;

  await db.account.update({
    where: { id: auth.id },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  void resend.emails.send({
    from: "MyDent <hello@mydent.one>",
    to: user.email,
    subject: "MyDent - Password Recovery",
    react: PasswordChanged({
      name: `${user.firstName} ${user.lastName}`,
    }),
  });

  redirect("/sign-in");
}
