import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { type Shortcut, ShortcutKeys } from "./shortcut-key";
import { LoadingSpinner } from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-8 md:h-9 md:px-4 md:py-2",
  {
    variants: {
      variant: {
        default:
          "shadow bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary:
          "shadow-sm bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        expandIcon:
          "group relative text-primary-foreground bg-primary hover:bg-primary/90",
        ringHover:
          "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ",
        gooeyRight:
          "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ",
        gooeyLeft:
          "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
        linkHover1:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        linkHover2:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
      },
      color: {
        default: "",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-background hover:bg-accent text-red-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 !p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  },
);

interface IconProps {
  Icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  Icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  shortcut?: (string | Shortcut)[] | string | Shortcut;
  shortcutPlacement?: "top" | "bottom" | "left" | "right";
  asChild?: boolean;
  isLoading?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
  (
    {
      className,
      variant,
      color,
      size,
      asChild = false,
      isLoading = false,
      children,
      Icon,
      iconPlacement,
      shortcut,
      shortcutPlacement = "bottom",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            className={cn(buttonVariants({ variant, color, size, className }))}
            disabled={isLoading ?? props.disabled}
            ref={ref}
            {...props}
          >
            {Icon && iconPlacement === "left" && (
              <div
                className={cn(
                  "md:group-hover:translate-x-100 mr-2 md:mr-0 md:w-0 md:translate-x-[0%] md:opacity-0 md:transition-all md:duration-200 md:group-hover:mr-2 md:group-hover:w-5 md:group-hover:opacity-100",
                  isLoading && "hidden",
                )}
              >
                <Icon className="size-5" />
              </div>
            )}
            {isLoading && <LoadingSpinner className="mr-2" />}
            <Slottable>{children}</Slottable>
            {Icon && iconPlacement === "right" && (
              <div
                className={cn(
                  "ml-0 w-0 translate-x-[100%] opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100",
                  isLoading && "hidden",
                )}
              >
                <Icon className="size-5" />
              </div>
            )}
          </Comp>
        </TooltipTrigger>
        {shortcut && (
          <TooltipContent
            className="md:flex items-center gap-1 hidden"
            side={shortcutPlacement}
          >
            <ShortcutKeys shortcut={shortcut} />
          </TooltipContent>
        )}
      </Tooltip>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
