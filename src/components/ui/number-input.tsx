import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

interface CustomNumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export default function NumberInput({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  onChange,
  className,
  ...props
}: CustomNumberInputProps) {
  const [value, setValue] = useState<number>(Number(props.defaultValue) || 0);

  const handleChange = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      setValue(clampedValue);
      onChange?.(clampedValue);
    },
    [min, max, onChange],
  );

  const increment = useCallback(
    () => handleChange(value + step),
    [handleChange, value, step],
  );
  const decrement = useCallback(
    () => handleChange(value - step),
    [handleChange, value, step],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? 0 : Number(e.target.value);
    if (!Number.isNaN(newValue)) {
      handleChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrement();
    }
  };

  return (
    <div className="flex">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={value <= min || props.disabled}
        aria-label="Decrease value"
        className="rounded-r-none"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`rounded-none border-x-0 ${className}`}
        min={min}
        max={max}
        step={step}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={value >= max || props.disabled}
        aria-label="Increase value"
        className="rounded-l-none"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
