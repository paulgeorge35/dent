"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";

interface DateTimePickerProps {
  id?: string;
  date: Date | undefined | null;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DateTimePicker({ id, date, setDate }: DateTimePickerProps) {
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDate = DateTime.fromJSDate(date).plus({
      days: Math.ceil(diffInDays),
    });
    setDate(newDate.toJSDate());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            DateTime.fromJSDate(date).toFormat("d MMM yyyy, HH:mm")
          ) : (
            <span>Pick a time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(d) => handleSelect(d)}
          initialFocus
        />
        <div className="border-t border-border p-3">
          <TimePickerDemo date={date ?? undefined} setDate={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
