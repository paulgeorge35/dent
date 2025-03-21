import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/translations";
import { cn, constructMetadata } from "@/lib/utils";
import React from "react";
import EmailSignIn from "./email-form";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function SignInEmail() {
  const t = await useTranslations("page.auth.sign-in.with-password");
  return (
    <React.Fragment>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-balance text-muted-foreground">{t("subtitle")}</p>
      </div>

      <EmailSignIn />

      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs uppercase text-muted-foreground">
          {t("or")}
        </span>
        <Separator className="w-auto grow" />
      </span>
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({
            variant: "secondary",
          }),
        )}
      >
        {t("create-account")}
      </Link>
    </React.Fragment>
  );
}
