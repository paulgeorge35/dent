"use server";

import { env } from "@/env";
import { googleClient } from "@/oauth";
import { redirect } from "next/navigation";

export async function signUpGoogle() {
  const authorizationUri = googleClient.authorizeURL({
    redirect_uri: new URL(env.GOOGLE_AUTH_CALLBACK_URL, env.URL).toString(),
    scope: "email profile",
  });

  redirect(authorizationUri);
}
