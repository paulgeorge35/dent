import type FullCalendar from "@fullcalendar/react";
import type { RefObject } from "react";
import { DateTime } from "luxon";

export default function renderTitle(calendarRef: RefObject<FullCalendar>) {
  const calendar = calendarRef.current?.getApi();
  if (!calendar) return;

  const isRange = !DateTime.fromJSDate(calendar.view.activeStart).equals(
    DateTime.fromJSDate(calendar.view.activeEnd).minus({ days: 1 }),
  );

  return (
    <h1 className="text-2xl font-semibold">
      {isRange
        ? `${DateTime.fromJSDate(calendar.view.activeStart).toFormat(
            "EEE, d MMM yyyy",
          )} - ${DateTime.fromJSDate(calendar.view.activeEnd).toFormat(
            "EEE, d MMM yyyy",
          )}`
        : DateTime.fromJSDate(calendar.getDate()).toFormat("EEE, d MMM yyyy")}
    </h1>
  );
}
