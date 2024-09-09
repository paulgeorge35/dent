"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { signUpGoogle } from "./actions";

export default function GoogleSignUp() {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("page.auth.sign-up");

  const handleClick = () => {
    startTransition(async () => {
      await signUpGoogle();
    });
  };

  return (
    <Button onClick={handleClick} isLoading={pending} variant="secondary">
      <Icons.google className="mr-2 size-5" />
      {t("continue-with-google")}
    </Button>
  );
}
