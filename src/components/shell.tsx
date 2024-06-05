import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const shellVariants = cva(
  "h-[100dvh] grid gap-4 w-screen overflow-y-auto p-4 max-w-screen md:max-w-[calc(100vw-250px)] relative m:h-screen",
  {
    variants: {
      variant: {
        default: "container",
        sidebar: "",
        centered:
          "container flex h-dvh max-w-2xl flex-col justify-center py-16",
        markdown: "container max-w-3xl py-8 md:py-10 lg:py-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

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
