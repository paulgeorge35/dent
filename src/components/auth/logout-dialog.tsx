"use client";

import { signOut } from "@/app/(router)/(tenant)/settings/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";

type LogoutDialogProps = {
  children?: React.ReactNode;
};

export default function LogoutDialog({ children }: LogoutDialogProps) {
  const t = useTranslations("layout.sidebar.controls.logout");
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        {children ?? (
          <Button
            Icon={LogOut}
            variant="expandIcon"
            color="destructive"
            iconPlacement="left"
            className="w-full sm:w-fit"
          >
            {t("trigger")}
          </Button>
        )}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("dialog.title")}</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaFooter className="gap-4">
          <CredenzaClose>{t("dialog.cancel")}</CredenzaClose>
          <Button disabled={pending} color="destructive" onClick={handleClick}>
            {t("dialog.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
