import { cn } from "@/lib/utils";
import type { DayHeaderContentArg } from "@fullcalendar/core";
import { DateTime } from "luxon";

export default function formatDayHeader(
  t: (key: string) => string,
  locale: string,
  arg: DayHeaderContentArg,
) {
  if (arg.view.type === "timeGridDay") {
    if (arg.isToday) return <p className={cn("text-xs font-normal")}>{t("today")}</p>;

    return (
      <p className={cn("text-xs font-normal")}>
        {locale === "ro"
          ? DateTime.fromJSDate(arg.date).toFormat("cccc, d LLLL", { locale })
          : DateTime.fromJSDate(arg.date).toFormat("ccc, LLL d", { locale })}
      </p>
    );
  }
  if (arg.view.type === "timeGridWeek")
    return (
      <p className={cn("text-xs font-normal", arg.isToday && "font-bold")}>
        {locale === "ro"
          ? DateTime.fromJSDate(arg.date).toFormat("cccc, d LLLL", { locale })
          : DateTime.fromJSDate(arg.date).toFormat("ccc, LLL d", { locale })}
      </p>
    );
  return (
    <p className={cn("text-xs font-normal", arg.isToday && "font-bold")}>
      {locale === "ro"
        ? DateTime.fromJSDate(arg.date).toFormat("ddd", { locale })
        : DateTime.fromJSDate(arg.date).toFormat("ccc", { locale })}
    </p>
  );
}
