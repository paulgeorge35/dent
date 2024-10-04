import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import RootFormError from "@/components/ui/root-form-error";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/translations";
import { cn, constructMetadata } from "@/lib/utils";
import type { SearchParams } from "@/types";
import { RectangleEllipsis } from "lucide-react";
import React from "react";
import { z } from "zod";
import GoogleSignIn from "./google";
import MagicLinkSignIn from "./magic-link-form";

export const metadata = constructMetadata({
  page: "Sign In",
});

const searchParamsSchema = z.object({
  error: z.string().optional(),
});

export interface SignInPageProps {
  searchParams: SearchParams;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = searchParamsSchema.parse(searchParams);
  const t = await useTranslations("page.auth.sign-in.with-email");

  return (
    <React.Fragment>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-balance text-muted-foreground">{t("subtitle")}</p>
      </div>
      <span className="vertical gap-4">
        <RootFormError error={error} />
        <GoogleSignIn />
      </span>
      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs uppercase text-muted-foreground">
          {t("or-email")}
        </span>
        <Separator className="w-auto grow" />
      </span>

      <MagicLinkSignIn />

      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs uppercase text-muted-foreground">
          {t("other-options")}
        </span>
        <Separator className="w-auto grow" />
      </span>
      <Link
        href="/sign-in/email"
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
        )}
      >
        <RectangleEllipsis className="mr-2 size-5" />
        {t("sign-in-with-password")}
      </Link>
    </React.Fragment>
  );
}
