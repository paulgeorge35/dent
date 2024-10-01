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
      if (onChange) {
        onChange(parsePrice(displayValue));
      }
    }, [displayValue]);

    function formatPrice(value: number): string {
      return (value / 100).toFixed(2);
    }

    function parsePrice(value: string): number {
      const parsed = Math.round(Number.parseFloat(value) * 100);
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const inputValue = e.target.value.replace(/[^\d.]/g, "");

      setDisplayValue(inputValue);

      if (onChange) {
        const parsedValue = Number.parseFloat(inputValue);
        onChange(Number.isNaN(parsedValue) ? 0 : parsedValue);
      }
    }

    function handleBlur() {
      const parsedValue = parsePrice(displayValue);
      const formattedValue = formatPrice(parsedValue);
      setDisplayValue(formattedValue);

      if (onChange) {
        onChange(parsedValue);
      }
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
