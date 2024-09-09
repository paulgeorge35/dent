"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

const SwitchView = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    values: [
      { value: string; label: string },
      { value: string; label: string },
    ];
  }
>(({ className, values, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group peer relative inline-flex h-9 w-[136px] shrink-0 cursor-pointer items-center rounded-sm border-2 border-transparent bg-input text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <span className="absolute left-0 z-10 flex w-16 items-center justify-center group-data-[state=checked]:opacity-30">
      {values[0].label}
    </span>
    <span className="absolute right-0 z-10 flex w-16 items-center justify-center group-data-[state=unchecked]:opacity-30">
      {values[1].label}
    </span>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-8 w-16 rounded-sm bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[68px] data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
SwitchView.displayName = SwitchPrimitives.Root.displayName;

export { SwitchView };
