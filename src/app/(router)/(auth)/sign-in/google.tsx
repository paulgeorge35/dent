"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useTransition } from "react";
import { signInGoogle } from "./actions";
import { useTranslations } from "next-intl";

export default function GoogleSignIn() {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("page.auth.sign-in.with-email");

  const handleClick = () => {
    startTransition(async () => {
      await signInGoogle();
    });
  };

  return (
    <Button onClick={handleClick} isLoading={pending} variant="secondary">
      <Icons.google className="mr-2 size-5" />
      {t("continue-with-google")}
    </Button>
  );
}
