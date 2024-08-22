import { type EventContentArg } from "@fullcalendar/core";
import { DateTime } from "luxon";

export default function renderEventContent(arg: EventContentArg) {
  return (
    <div>
      <p className="font-semibold">{arg.event.title ?? "(New Event)"}</p>
      {arg.event.allDay ? (
        <p>All day</p>
      ) : (
        <p className="">
          {arg.event.start
            ? DateTime.fromJSDate(arg.event.start).toFormat("H:mm")
            : null}
          {arg.event.start && arg.event.end ? " - " : null}
          {arg.event.end
            ? DateTime.fromJSDate(arg.event.end).toFormat("H:mm")
            : null}
        </p>
      )}
    </div>
  );
}
