"use client";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import { signOut } from "@/app/(router)/(tenant)/settings/actions";

type LogoutDialogProps = {
  children?: React.ReactNode;
};

export default function LogoutDialog({ children }: LogoutDialogProps) {
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
            Log Out
          </Button>
        )}
      </TriggerComponent>
      <ContentComponent>
        <HeaderComponent>
          <TitleComponent>Are you sure you want to sign out?</TitleComponent>
        </HeaderComponent>
        <FooterComponent className="gap-4">
          <CloseComponent>Cancel</CloseComponent>
          <Button disabled={pending} color="destructive" onClick={handleClick}>
            Log Out
          </Button>
        </FooterComponent>
      </ContentComponent>
    </Credenza>
  );
}
