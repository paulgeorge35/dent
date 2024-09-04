"use server";

import { googleClient } from "@/oauth";
import { env } from "@/env";
import { redirect } from "next/navigation";

export async function signUpGoogle() {
  const authorizationUri = googleClient.authorizeURL({
    redirect_uri: new URL(env.GOOGLE_AUTH_CALLBACK_URL, env.URL).toString(),
    scope: "email profile",
  });

  redirect(authorizationUri);
}
