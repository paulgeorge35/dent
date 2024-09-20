import type FullCalendar from "@fullcalendar/react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import type { RefObject } from "react";

export default function renderTitle(calendarRef: RefObject<FullCalendar>) {
  const locale = useLocale();
  const dayFormat = locale === "ro" ? "EEEE" : "EEE";

  const calendar = calendarRef.current?.getApi();
  if (!calendar) return;

  const isCurrentYear =
    DateTime.now().year === DateTime.fromJSDate(calendar.view.activeStart).year;

  const format = isCurrentYear ? "d MMM" : "d MMM yyyy";

  const isRange = !DateTime.fromJSDate(calendar.view.activeStart).equals(
    DateTime.fromJSDate(calendar.view.activeEnd).minus({ days: 1 }),
  );

  return (
    <h1 className="text-2xl font-semibold text-balance text-center">
      {isRange
        ? `${DateTime.fromJSDate(calendar.view.activeStart).toFormat(format, {
            locale: locale,
          })} - ${DateTime.fromJSDate(calendar.view.activeEnd).toFormat(
            format,
            { locale: locale },
          )}`
        : DateTime.fromJSDate(calendar.getDate()).toFormat(`${dayFormat}, ${format}`, {
            locale: locale,
          })}
    </h1>
  );
}
