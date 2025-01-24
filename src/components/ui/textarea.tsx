import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  charLimit?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, charLimit, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "text-area relative flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
        {charLimit && (
          <div
            className={cn(
              "absolute -top-7 right-0 rounded-md border border-input bg-background px-1 py-0.5 text-xs text-muted-foreground",
              {
                "border-red-500 text-red-500":
                  props.value?.toString().length &&
                  props.value?.toString().length > charLimit,
                "border-green-500 text-green-500":
                  props.value?.toString().length &&
                  props.value?.toString().length <= charLimit,
              },
            )}
          >
            {props.value?.toString().length ?? 0} / {charLimit ?? "∞"}
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
