"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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

  const Credenza = isDesktop ? Dialog : Drawer;
  const CredenzaContent = isDesktop ? DialogContent : DrawerContent;
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader;
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription;
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter;
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose;
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {trigger && <CredenzaTrigger>{trigger}</CredenzaTrigger>}
      <CredenzaContent>
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
