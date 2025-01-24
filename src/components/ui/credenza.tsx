"use client";

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
import { cn } from "@/lib/utils";
import type * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as SheetPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ScrollArea } from "./scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  type SheetContentProps,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

interface BaseProps {
  children: React.ReactNode;
  sheet?: boolean;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const CredenzaContext = createContext<{ isDesktop: boolean }>({
  isDesktop: true,
});

const Credenza = ({ children, sheet, dismissible = true, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const [isDesktopState, setIsDesktopState] = React.useState(isDesktop);

  React.useEffect(() => {
    setIsDesktopState(isDesktop);
  }, [isDesktop]);

  return (
    <CredenzaContext.Provider value={{ isDesktop: isDesktopState }}>
      {isDesktopState ? (
        sheet ? (
          <Sheet {...props}>{children}</Sheet>
        ) : (
          <Dialog {...props}>{children}</Dialog>
        )
      ) : (
        <Drawer dismissible={dismissible} {...props}>{children}</Drawer>
      )}
    </CredenzaContext.Provider>
  );
};

type CredenzaTriggerProps = CredenzaProps &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> &
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger> &
  React.ComponentPropsWithoutRef<typeof DrawerTrigger>;

const CredenzaTrigger = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaTriggerProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetTrigger className={className} {...props}>
        {children}
      </SheetTrigger>
    ) : (
      <DialogTrigger className={className} {...props}>
        {children}
      </DialogTrigger>
    )
  ) : (
    <DrawerTrigger className={className} {...props}>
      {children}
    </DrawerTrigger>
  );
};

type CredenzaCloseProps = CredenzaProps &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> &
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close> &
  React.ComponentPropsWithoutRef<typeof DrawerClose>;

const CredenzaClose = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaCloseProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetClose className={className} {...props}>
        {children}
      </SheetClose>
    ) : (
      <DialogClose className={className} {...props}>
        {children}
      </DialogClose>
    )
  ) : (
    <DrawerClose className={className} {...props}>
      {children}
    </DrawerClose>
  );
};

type CredenzaContentProps = CredenzaProps &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  Omit<SheetContentProps, "children"> &
  React.ComponentPropsWithoutRef<typeof DrawerContent>;

const CredenzaContent = React.forwardRef<HTMLDivElement, CredenzaContentProps>(
  (
    { className, children, sheet, noOverlay, noCloseButton, side, ...props },
    ref,
  ) => {
    const { isDesktop } = useContext(CredenzaContext);
    return isDesktop ? (
      sheet ? (
        <SheetContent
          ref={ref}
          className={className}
          side={side}
          noOverlay={noOverlay}
          noCloseButton={noCloseButton}
          {...props}
        >
          {children}
        </SheetContent>
      ) : (
        <DialogContent ref={ref} className={className} {...props}>
          {children}
        </DialogContent>
      )
    ) : (
      <DrawerContent
        noOverlay={noOverlay}
        ref={ref}
        className={cn(
          {
            "pb-4": window.matchMedia("(display-mode: standalone)").matches,
          },
          className,
        )}
        {...props}
      >
        {children}
      </DrawerContent>
    );
  },
);
CredenzaContent.displayName = "CredenzaContent";

type CredenzaDescriptionProps = CredenzaProps &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> &
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> &
  React.ComponentPropsWithoutRef<typeof DrawerDescription>;

const CredenzaDescription = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaDescriptionProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetDescription className={className} {...props}>
        {children}
      </SheetDescription>
    ) : (
      <DialogDescription className={className} {...props}>
        {children}
      </DialogDescription>
    )
  ) : (
    <DrawerDescription className={className} {...props}>
      {children}
    </DrawerDescription>
  );
};

type CredenzaHeaderProps = CredenzaProps & React.HTMLAttributes<HTMLDivElement>;

const CredenzaHeader = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaHeaderProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetHeader className={className} {...props}>
        {children}
      </SheetHeader>
    ) : (
      <DialogHeader className={className} {...props}>
        {children}
      </DialogHeader>
    )
  ) : (
    <DrawerHeader className={className} {...props}>
      {children}
    </DrawerHeader>
  );
};

type CredenzaTitleProps = CredenzaProps &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> &
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> &
  React.ComponentPropsWithoutRef<typeof DrawerTitle>;

const CredenzaTitle = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaTitleProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetTitle className={className} {...props}>
        {children}
      </SheetTitle>
    ) : (
      <DialogTitle className={className} {...props}>
        {children}
      </DialogTitle>
    )
  ) : (
    <DrawerTitle className={className} {...props}>
      {children}
    </DrawerTitle>
  );
};

const CredenzaBody = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        setScrollTop(scrollAreaRef.current.scrollTop);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <ScrollArea
        className="relative grow"
        viewportRef={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-50 h-16 bg-gradient-to-b from-secondary to-transparent transition-[height] duration-300 ease-in-out",
            {
              "h-0": scrollTop <= 0,
            },
          )}
        />
        <div className={cn("px-4", className)} {...props}>
          {children}
        </div>
        <div
          className={cn(
            "ease-in-outƒ pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-secondary to-transparent transition-[height] duration-300",
            {
              "h-0":
                scrollTop + (scrollAreaRef.current?.clientHeight ?? 0) >=
                (scrollAreaRef.current?.scrollHeight ?? 0),
            },
          )}
        />
      </ScrollArea>
    </AnimatePresence>
  );
};

type CredenzaFooterProps = CredenzaProps & React.HTMLAttributes<HTMLDivElement>;

const CredenzaFooter = ({
  className,
  children,
  sheet,
  ...props
}: CredenzaFooterProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    sheet ? (
      <SheetFooter className={className} {...props}>
        {children}
      </SheetFooter>
    ) : (
      <DialogFooter className={className} {...props}>
        {children}
      </DialogFooter>
    )
  ) : (
    <DrawerFooter className={className} {...props}>
      {children}
    </DrawerFooter>
  );
};

export {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger
};

