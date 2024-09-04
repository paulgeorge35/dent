"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";

type ConfirmationDialogProps = {
  trigger: React.ReactNode;
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
      <CredenzaTrigger>{trigger}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          {isDesktop && (
            <CredenzaClose>
              <Button variant="outline">Cancel</Button>
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
