"use server";

import { sendActivationLink } from "@/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export async function resendActivationLink(email: string) {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) return;

  await sendActivationLink(email, user.name);
  redirect("/sign-up/activate");
}
