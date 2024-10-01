"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import useMediaQuery from "@/hooks/use-media-query";
import { useTranslations } from "next-intl";

type ConfirmationDialogProps = {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  confirmButtonText: string;
  onConfirm: () => void;
  loading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmButtonText,
  onConfirm,
  loading,
  open,
  onOpenChange,
}: ConfirmationDialogProps) {
  const t = useTranslations("layout.confirmation-dialog");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {trigger && <CredenzaTrigger asChild>{trigger}</CredenzaTrigger>}
      <CredenzaContent className="!h-auto">
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          {isDesktop && (
            <CredenzaClose>
              <Button variant="outline">{t("cancel")}</Button>
            </CredenzaClose>
          )}
          <Button onClick={onConfirm} isLoading={loading}>
            {confirmButtonText}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
