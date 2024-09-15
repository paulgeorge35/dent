"use client";

import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { type ChangeEvent, forwardRef, useState } from "react";

interface PriceInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
}

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ value = 0, onChange, currency = "RON", ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatPrice(value));

    function formatPrice(value: number): string {
      return (value / 100).toFixed(2);
    }

    function parsePrice(value: string): number {
      return Math.round(Number.parseFloat(value) * 100);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
      <div className="relative">
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
  },
);

PriceInput.displayName = "PriceInput";

export default PriceInput;
