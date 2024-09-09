import { cn } from "@/lib/utils";
import type { DayHeaderContentArg } from "@fullcalendar/core";
import { DateTime } from "luxon";

export default function formatDayHeader(arg: DayHeaderContentArg) {
  if (arg.view.type === "timeGridDay") {
    if (arg.isToday) return <p className={cn("text-xs font-normal")}>Today</p>;

    return (
      <p className={cn("text-xs font-normal")}>
        {DateTime.fromJSDate(arg.date).toFormat("ccc, LLL d")}
      </p>
    );
  }
  if (arg.view.type === "timeGridWeek")
    return (
      <p className={cn("text-xs font-normal", arg.isToday && "font-bold")}>
        {DateTime.fromJSDate(arg.date).toFormat("ccc, LLL d")}
      </p>
    );
  return (
    <p className={cn("text-xs font-normal", arg.isToday && "font-bold")}>
      {DateTime.fromJSDate(arg.date).toFormat("ccc")}
    </p>
  );
}
