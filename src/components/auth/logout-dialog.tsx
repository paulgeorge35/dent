"use client";

import { signOut } from "@/app/(router)/(tenant)/settings/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

type LogoutDialogProps = {
  children?: React.ReactNode;
};

export default function LogoutDialog({ children }: LogoutDialogProps) {
  const t = useTranslations("layout.sidebar.controls.logout");
  const [pending, startTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleClick = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const Credenza = isDesktop ? Dialog : Drawer;
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const FooterComponent = isDesktop ? DialogFooter : DrawerFooter;
  const CloseComponent = isDesktop ? DialogClose : DrawerClose;

  return (
    <Credenza>
      <TriggerComponent asChild>
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
      </TriggerComponent>
      <ContentComponent>
        <HeaderComponent>
          <TitleComponent>{t("dialog.title")}</TitleComponent>
        </HeaderComponent>
        <FooterComponent className="gap-4">
          <CloseComponent>{t("dialog.cancel")}</CloseComponent>
          <Button disabled={pending} color="destructive" onClick={handleClick}>
            {t("dialog.confirm")}
          </Button>
        </FooterComponent>
      </ContentComponent>
    </Credenza>
  );
}
