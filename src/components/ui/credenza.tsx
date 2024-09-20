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
import * as React from "react";
import { createContext, useContext } from "react";

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const CredenzaContext = createContext<{ isDesktop: boolean }>({
  isDesktop: true,
});

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const [isDesktopState, setIsDesktopState] = React.useState(isDesktop);

  React.useEffect(() => {
    setIsDesktopState(isDesktop);
  }, [isDesktop]);

  return (
    <CredenzaContext.Provider value={{ isDesktop: isDesktopState }}>
      {isDesktopState ? (
        <Dialog {...props}>{children}</Dialog>
      ) : (
        <Drawer {...props}>{children}</Drawer>
      )}
    </CredenzaContext.Provider>
  );
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogTrigger className={className} {...props}>
      {children}
    </DialogTrigger>
  ) : (
    <DrawerTrigger className={className} {...props}>
      {children}
    </DrawerTrigger>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogClose className={className} {...props}>
      {children}
    </DialogClose>
  ) : (
    <DrawerClose className={className} {...props}>
      {children}
    </DrawerClose>
  );
};

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  ) : (
    <DrawerContent className={className} {...props}>
      {children}
    </DrawerContent>
  );
};

const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  ) : (
    <DrawerDescription className={className} {...props}>
      {children}
    </DrawerDescription>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  ) : (
    <DrawerHeader className={className} {...props}>
      {children}
    </DrawerHeader>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  ) : (
    <DrawerTitle className={className} {...props}>
      {children}
    </DrawerTitle>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useContext(CredenzaContext);
  return isDesktop ? (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  ) : (
    <DrawerFooter className={className} {...props}>
      {children}
    </DrawerFooter>
  );
};

export {
  Credenza, CredenzaBody, CredenzaClose,
  CredenzaContent,
  CredenzaDescription, CredenzaFooter, CredenzaHeader,
  CredenzaTitle, CredenzaTrigger
};

