"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

interface TagInputProps {
  id: string;
  value?: string[];
  onChange: (value: string[]) => void;
  separator?: string;
  placeholder?: string;
  charLimit?: number;
}

export function TagInput({
  id,
  value = [],
  onChange,
  separator = ",",
  placeholder,
  charLimit,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (charLimit && newValue.length > charLimit) return;
      setInputValue(newValue);

      if (newValue.endsWith(separator)) {
        const trimmedValue = newValue.slice(0, -separator.length).trim();
        if (trimmedValue && (!charLimit || trimmedValue.length <= charLimit)) {
          onChange([...value, trimmedValue]);
          setInputValue("");
        }
      }
    },
    [value, onChange, separator, charLimit],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        if (!charLimit || inputValue.trim().length <= charLimit) {
          onChange([...value, inputValue.trim()]);
          setInputValue("");
        }
      }
    },
    [inputValue, value, onChange, charLimit],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const isAtMaxChars = charLimit && inputValue.length >= charLimit;

  return (
    <div className="space-y-2 relative">
      <div className="flex flex-wrap gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(index)}
            />
          </Badge>
        ))}
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm",
            isAtMaxChars && "text-destructive",
          )}
        />
      </div>
      {charLimit && (
        <div
          className={cn(
            "absolute -top-7 right-0 rounded-md border border-input bg-background px-1 py-0.5 text-xs text-muted-foreground",
            {
              "border-red-500 text-red-500":
                value?.toString().length &&
                value?.toString().length > charLimit,
              "border-green-500 text-green-500":
                value?.toString().length &&
                value?.toString().length <= charLimit,
            },
          )}
        >
          {value?.toString().length ?? 0} / {charLimit ?? "∞"}
        </div>
      )}
    </div>
  );
}
