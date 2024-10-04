import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { constructMetadata } from "@/lib/utils";
import React from "react";
import ChangePasswordForm from "./change-password-form";

export const metadata = constructMetadata({
  page: "Reset Password",
});

const queryParamsSchema = z.object({
  token: z.string(),
});

export interface ForgotPasswordPageProps {
  searchParams: SearchParams;
}

export default async function ForgotPassword({
  searchParams,
}: ForgotPasswordPageProps) {
  const schema = queryParamsSchema.safeParse(searchParams);

  if (schema.error) redirect("/sign-in");

  const isTokenValid = await api.user.verifyToken({
    token: schema.data.token,
    type: "PASSWORD_RESET",
  });

  if (!isTokenValid) redirect("/sign-in");

  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <React.Fragment>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      <ChangePasswordForm token={schema.data.token} />

      <Link href="/sign-in" className="text-center underline">
        Back to login
      </Link>
    </React.Fragment>
  );
}
