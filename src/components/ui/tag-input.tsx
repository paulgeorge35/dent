"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TagInputProps {
  id: string;
  value?: string[];
  onChange: (value: string[]) => void;
  separator?: string;
  placeholder?: string;
  charLimit?: number;
  suggestions?: string[];
}

export function TagInput({
  id,
  value = [],
  onChange,
  separator = ",",
  placeholder,
  charLimit,
  suggestions,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const filteredSuggestions =
    suggestions?.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()),
    ) || [];

  const firstSuggestion = filteredSuggestions[0];

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (charLimit && newValue.length > charLimit) return;
      setInputValue(newValue);
      setShowSuggestions(true);
      setActiveSuggestion(0);

      if (newValue.endsWith(separator)) {
        const trimmedValue = newValue.slice(0, -separator.length).trim();
        if (trimmedValue && (!charLimit || trimmedValue.length <= charLimit)) {
          onChange([...value, trimmedValue]);
          setInputValue("");
          setShowSuggestions(false);
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
          setShowSuggestions(false);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion(
          (prev) =>
            (prev - 1 + filteredSuggestions.length) %
            filteredSuggestions.length,
        );
      }
    },
    [inputValue, value, onChange, charLimit, filteredSuggestions],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      if (!charLimit || suggestion.length <= charLimit) {
        onChange([...value, suggestion]);
        setInputValue("");
        setShowSuggestions(false);
        inputRef.current?.focus();
      }
    },
    [value, onChange, charLimit],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base",
            isAtMaxChars && "text-destructive",
          )}
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-auto max-h-60"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                index === activeSuggestion &&
                  "bg-accent text-accent-foreground",
              )}
              onClick={() => selectSuggestion(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  selectSuggestion(suggestion);
                }
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
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
