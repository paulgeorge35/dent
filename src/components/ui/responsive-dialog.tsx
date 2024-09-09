"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useBoolean } from "react-hanger";

type ResponsiveDrawerSheetProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DesktopSheetProps = {
  children: React.ReactNode;
};

const DesktopSheet = ({ children }: DesktopSheetProps) => (
  <SheetContent
    side="right"
    className="mx-4 my-8 h-[calc(100vh-64px)] w-[400px] rounded-lg sm:w-[540px]"
  >
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  </SheetContent>
);

const ResponsiveDrawerSheet = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
}: ResponsiveDrawerSheetProps) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () =>
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const content = (
    <>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      {children}
    </>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline">{trigger}</Button>
        </SheetTrigger>
        <DesktopSheet>{content}</DesktopSheet>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

type DrawerProps = {
  title: string;
  description: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
};

export default function Component({
  title,
  description,
  trigger,
  content,
}: DrawerProps) {
  const open = useBoolean(false);

  return (
    <div className="p-4">
      <ResponsiveDrawerSheet
        open={open.value}
        onOpenChange={open.toggle}
        trigger={trigger}
        title={title}
        description={description}
      >
        <div className="space-y-4 p-4">{content}</div>
      </ResponsiveDrawerSheet>
    </div>
  );
}
