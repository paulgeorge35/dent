import RootFormError from "@/components/ui/root-form-error";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/translations";
import { constructMetadata } from "@/lib/utils";
import type { SearchParams } from "@/types";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import GoogleSignUp from "./google";
import RegisterForm from "./register-form";

export const metadata = constructMetadata({
  page: "Sign Up",
});

const searchParamsSchema = z.object({
  error: z.string().optional(),
  email: z.string().optional(),
});

export interface SignUpPageProps {
  searchParams: Promise<SearchParams>;
}
export default async function SignUp(props: SignUpPageProps) {
  const searchParams = await props.searchParams;
  const t = await useTranslations("page.auth.sign-up");
  const { error, email } = searchParamsSchema.parse(searchParams);

  return (
    <React.Fragment>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-balance text-muted-foreground">{t("subtitle")}</p>
      </div>
      <span className="vertical gap-4">
        <RootFormError error={error} />
        <GoogleSignUp />
      </span>
      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs text-muted-foreground uppercase">
          {t("or-email")}
        </span>
        <Separator className="w-auto grow" />
      </span>

      <RegisterForm email={email} />

      <div className="mt-4 text-center text-sm">
        {t("already-have-account")}{" "}
        <Link href="/sign-in" className="underline">
          {t("sign-in")}
        </Link>
      </div>
    </React.Fragment>
  );
}
