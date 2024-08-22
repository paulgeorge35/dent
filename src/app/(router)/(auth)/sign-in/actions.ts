"use server";

import { sendMagicLink } from "@/auth";
import { env } from "@/env";
import { googleClient } from "@/oauth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export async function signInMagicLink(email: string) {
  const user = await db.user.findFirst({
    where: {
      profile: { email },
      deletedAt: null,
      tenant: {
        deletedAt: null,
      },
    },
    select: {
      profile: {
        select: {
          email: true,
          preferredTenantId: true,
        },
      },
      bannedAt: true,
      activatedAt: true,
      tenantId: true,
    },
  });

  if (!user) return;

  if (user.bannedAt) {
    throw new Error("Your account has been banned");
  }

  void sendMagicLink(email, user.profile.preferredTenantId ?? user.tenantId);

  redirect("/sign-in/magic");
}

export async function signInGoogle() {
  const authorizationUri = googleClient.authorizeURL({
    redirect_uri: new URL(env.GOOGLE_AUTH_CALLBACK_URL, env.URL).toString(),
    scope: "email profile",
  });

  redirect(authorizationUri);
}
