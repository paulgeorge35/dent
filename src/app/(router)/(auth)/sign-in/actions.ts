"use server";

import { sendMagicLink } from "@/auth";
import { env } from "@/env";
import { googleClient } from "@/oauth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export async function signInMagicLink(email: string) {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) return;

  if (user.banned) {
    throw new Error("Your account has been banned");
  }

  if (!user.emailVerified) {
    redirect("/sign-in/activate");
  }

  void sendMagicLink(email);

  redirect("/sign-in/magic");
}

export async function signInGoogle() {
  const authorizationUri = googleClient.authorizeURL({
    redirect_uri: new URL(env.GOOGLE_CALLBACK_URL, env.URL).toString(),
    scope: "email profile",
  });

  redirect(authorizationUri);
}
