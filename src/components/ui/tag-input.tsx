"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  separator: string;
  placeholder?: string;
  maxChars?: number;
}

export function TagInput({
  value = [],
  onChange,
  separator,
  placeholder = "Type and press Enter...",
  maxChars,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (maxChars && newValue.length > maxChars) return;
      setInputValue(newValue);

      if (newValue.endsWith(separator)) {
        const trimmedValue = newValue.slice(0, -separator.length).trim();
        if (trimmedValue && (!maxChars || trimmedValue.length <= maxChars)) {
          onChange([...value, trimmedValue]);
          setInputValue("");
        }
      }
    },
    [value, onChange, separator, maxChars],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        if (!maxChars || inputValue.trim().length <= maxChars) {
          onChange([...value, inputValue.trim()]);
          setInputValue("");
        }
      }
    },
    [inputValue, value, onChange, maxChars],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const isAtMaxChars = maxChars && inputValue.length >= maxChars;

  return (
    <div className="space-y-2">
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
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            isAtMaxChars && "text-destructive",
          )}
        />
      </div>
      {maxChars && (
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isAtMaxChars && "text-destructive",
          )}
        >
          {inputValue.length}/{maxChars} characters
        </p>
      )}
    </div>
  );
}
