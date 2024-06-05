"use server";

import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { consumeToken } from "@/auth";
import { resend } from "@/server/resend";
import { PasswordChanged } from "@/components/emails/password-changed";

export async function updatePassword(token: string, password: string) {
  const user = await consumeToken(token, "PASSWORD_RESET");

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  void resend.emails.send({
    from: "MyDent <contact@paulgeorge.dev>",
    to: user.email,
    subject: "MyDent - Password Recovery",
    react: PasswordChanged({
      name: user.name,
    }),
  });

  redirect("/sign-in");
}
