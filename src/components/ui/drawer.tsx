"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const Drawer = ({
  shouldScaleBackground = true,
  direction,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  direction?: "top" | "right" | "bottom" | "left";
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <DrawerPrimitive.Root
      direction={direction ?? (isDesktop ? "right" : "bottom")}
      handleOnly
      shouldScaleBackground={shouldScaleBackground}
      repositionInputs={false}
      {...props}
    />
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerHandle = DrawerPrimitive.Handle;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-background/20 backdrop-blur-sm transition-[backdrop-filter] duration-200", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    noOverlay?: boolean;
  }
>(({ className, children, noOverlay = false, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <DrawerPortal>
      <DrawerOverlay className={cn({ invisible: noOverlay })} />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 vertical border bg-background outline-none shadow-lg",
          {
            "inset-x-0 bottom-0 mt-24 rounded-t-xl h-screen max-h-[95dvh]":
              !isDesktop,
          },
          {
            "inset-y-4 right-4 rounded-lg h-[calc(100vh-32px)] w-[90vw] max-w-3xl after:hidden":
              isDesktop,
          },
          className,
        )}
        {...props}
      >
        <DrawerHandle
          className={cn("!w-20 mt-2", {
            "!hidden": isDesktop,
          })}
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
}) => {
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

  const clientHeight = useMemo(() => scrollAreaRef.current?.clientHeight ?? 0, [scrollTop]);
  const scrollHeight = useMemo(() => scrollAreaRef.current?.scrollHeight ?? 0, [scrollTop]);
  const scrollPosition = useMemo(() => scrollHeight - clientHeight - 1, [scrollHeight, clientHeight]);

  useEffect(() => {
    setScrollTop(0);
    scrollAreaRef.current?.scrollTo({ top: 0 });
  }, []);

  return (
    <AnimatePresence mode="wait">
      <div className="relative overflow-hidden grow">
        <div
          className="h-full w-full rounded-[inherit] overflow-y-auto"
          ref={scrollAreaRef}
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
              "ease-in-out pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-secondary to-transparent transition-[height] duration-300",
              {
                "h-0":
                  scrollTop >= scrollPosition,
              },
            )}
          />
        </div>
      </div>
    </AnimatePresence>
  );
};
DrawerBody.displayName = "DrawerBody";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div
      className={cn(
        "mt-auto grid grid-cols-1 gap-2 p-4",
        {
          "grid-cols-2": isDesktop,
        },
        className,
      )}
      {...props}
    />
  );
};

DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export type DrawerProps = React.ComponentProps<typeof Drawer>;

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
};

