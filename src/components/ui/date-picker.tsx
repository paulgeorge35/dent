"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";

type DatePickerProps = {
  value: Date;
  onChange: (day: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "block justify-start rounded-l-none border-0 border-l-4 border-l-blue-500 !px-2 !py-1 text-left text-lg font-normal shadow-none",
            !value && "text-muted-foreground",
          )}
        >
          {DateTime.fromJSDate(value).toFormat("cccc, d LLLL yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
