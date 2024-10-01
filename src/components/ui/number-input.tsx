import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useCallback } from "react";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  min?: number;
  max?: number;
  step?: number;
  actions?: boolean;
  onChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      onChange,
      className,
      actions = true,
      defaultValue = 0,
      ...props
    },
    ref
  ) => {

    const handleChange = useCallback(
      (newValue: number) => {
        const clampedValue = Math.min(Math.max(newValue, min), max);
        onChange?.(clampedValue);
      },
      [min, max, onChange]
    );

    const increment = useCallback(
      () => handleChange(Number(props.value) + step),
      [handleChange, props.value, step]
    );
    const decrement = useCallback(
      () => handleChange(Number(props.value) - step),
      [handleChange, props.value, step]
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
          disabled={Number(props.value) <= min || props.disabled}
          aria-label="Decrease value"
          className={cn("rounded-r-none", {
            hidden: !actions,
          })}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={props.value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`rounded-none border-x-0 ${className} z-[2] text-center`}
          min={min}
          max={max}
          step={step}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={Number(props.value) >= max || props.disabled}
          aria-label="Increase value"
          className={cn("rounded-l-none", {
            hidden: !actions,
          })}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
