"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface PriceInputProps
extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, value = 0, onChange, currency = "RON", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(formatPrice(value));

    React.useEffect(() => {
      setDisplayValue(formatPrice(value));
    }, [value]);

    function formatPrice(value: number): string {
      return (value / 100).toFixed(2);
    }

    function parsePrice(value: string): number {
      return Math.round(Number.parseFloat(value) * 100);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const inputValue = e.target.value.replace(/[^\d.]/g, "");
      const parsedValue = parsePrice(inputValue);

      setDisplayValue(inputValue);

      if (onChange) {
        onChange(parsedValue);
      }
    }

    function handleBlur() {
      const formattedValue = formatPrice(parsePrice(displayValue));
      setDisplayValue(formattedValue);
    }

    return (
      <div className={cn("relative", className)}>
        <Input
          {...props}
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
          {currency}
        </span>
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";

export default PriceInput;
