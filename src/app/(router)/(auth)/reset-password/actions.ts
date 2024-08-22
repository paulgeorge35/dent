"use server";

import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { consumeToken } from "@/auth";
import { resend } from "@/server/resend";
import { PasswordChanged } from "@/components/emails/password-changed";

export async function updatePassword(token: string, password: string) {
  const user = await consumeToken(token, "PASSWORD_RESET");

  const profile = await db.profile.findFirst({
    where: { email: user.profile.email },
  });

  if (!profile) return;

  const auth = await db.accountAuth.findFirst({
    where: {
      profileId: profile.id,
      type: "credentials",
      provider: "database",
    },
  });

  if (!auth) return;

  await db.accountAuth.update({
    where: { id: auth.id },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  void resend.emails.send({
    from: "MyDent <hello@mydent.one>",
    to: user.profile.email,
    subject: "MyDent - Password Recovery",
    react: PasswordChanged({
      name: `${user.profile.firstName} ${user.profile.lastName}`,
    }),
  });

  redirect("/sign-in");
}
