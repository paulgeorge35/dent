import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./spinner";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placehold?: "string";
  search?: boolean;
  searchClassName?: string;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, search, searchClassName, loading, ...props }, ref) => {
    return search ? (
      <span
        className={cn(
          "flex h-12 w-full items-center rounded-md border border-input bg-background text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          searchClassName,
        )}
      >
        <MagnifyingGlassIcon className="mx-3 h-4 w-4 shrink-0 opacity-50" />
        <input
          type={type}
          className={cn(
            "flex h-9 w-full text-base rounded-md border-none bg-transparent placeholder:text-muted-foreground focus:border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {loading && <LoadingSpinner className="text-blue-500 m-3" />}
      </span>
    ) : (
      <input
        type={type}
        autoComplete={props.name}
        className={cn(
          "flex h-9 w-full text-base rounded-md border border-input bg-background px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
