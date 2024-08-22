import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const shellVariants = cva("", {
  variants: {
    variant: {
      default: "vertical gap-4 relative w-full",
      layout: "min-h-[100dvh] md:min-h-screen md:pt-16 vertical center-h",
      nav: "hidden md:horizontal center-v gap-4 fixed top-0 h-16 right-0 w-screen z-10 border-b p-4 text-sm bg-background",
      center: "vertical flex-1 p-4 md:max-w-screen-5xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({
  className,
  as: Comp = "section",
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

export { Shell, shellVariants };
