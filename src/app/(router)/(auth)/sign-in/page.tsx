import Link from "next/link";

import MagicLinkSignIn from "./magic-link-form";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import GoogleSignIn from "./google";
import { type SearchParams } from "@/types";
import { z } from "zod";
import RootFormError from "@/components/ui/root-form-error";
import { constructMetadata } from "@/lib/utils";
import { useTranslations } from "@/lib/translations";
import { RectangleEllipsis } from "lucide-react";

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
    <>
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
    </>
  );
}
