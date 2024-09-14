"use client";

import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { EventContentArg } from "@fullcalendar/core";
import type { EventStatus, Service } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

function EventDetails({ services }: { services: Service[] | undefined }) {
  return (
    <span className="flex flex-wrap gap-1">
      {services?.map((service) => (
        <span
          key={service.id}
          className="rounded-full border border-input bg-background/50 px-2 py-1 text-xs"
        >
          {service?.name}
        </span>
      ))}
    </span>
  );
}

function EventStatusComponent({
  status,
  isDraft,
}: { status: EventStatus | "DRAFT"; isDraft: boolean }) {
  const t = useTranslations("enums.event.status");
  return (
    <span className="horizontal border border-input items-center gap-2 rounded-md bg-background/50 px-2 py-1 text-xs text-secondary-foreground">
      <span
        className={cn("size-2 rounded-full mb-[2px]", {
          "bg-teal-400": status === "CREATED",
          "bg-blue-400": status === "CONFIRMED",
          "bg-red-400": status === "CANCELLED",
          "bg-green-400": status === "COMPLETED",
          "bg-yellow-400": status === "RESCHEDULED",
          "bg-teal-200": isDraft,
        })}
      />
      <p className="text-xs font-light">{t(status)}</p>
    </span>
  );
}

function EventIcon({ status }: { status: EventStatus | "DRAFT" }) {
  if (status === "CREATED") {
    return (
      <Icons.calendarCheck className="size-5 rounded-md bg-teal-400 p-1 text-primary-foreground" />
    );
  }
  if (status === "CONFIRMED") {
    return (
      <Icons.calendarCheck className="size-5 rounded-md bg-blue-400 p-1 text-primary-foreground" />
    );
  }
  if (status === "CANCELLED") {
    return (
      <Icons.calendarCheck className="size-5 rounded-md bg-red-400 p-1 text-primary-foreground" />
    );
  }
  if (status === "COMPLETED") {
    return (
      <Icons.calendarCheck className="size-5 rounded-md bg-green-400 p-1 text-primary-foreground" />
    );
  }
  if (status === "RESCHEDULED") {
    return (
      <Icons.calendarCheck className="size-5 rounded-md bg-yellow-400 p-1 text-primary-foreground" />
    );
  }
  return;
}

function EventContent({
  arg,
  isDayOff,
}: { arg: EventContentArg; isDayOff: boolean }) {
  const t = useTranslations("page.appointments.calendar");
  const { data: event } = api.appointment.get.useQuery(arg.event.id);
  const services = event?.visits.flatMap((visit) => visit.service);

  return (
    <div className="horizontal p-2 h-full min-w-[250px] w-full items-start gap-2">
      {!isDayOff && <EventIcon status={event?.status ?? "DRAFT"} />}
      <div className="vertical h-full w-full items-start gap-1 text-secondary-foreground">
        {!isDayOff && (
          <EventStatusComponent
            status={event?.status ?? "DRAFT"}
            isDraft={!arg.event.id}
          />
        )}
        <p>{arg.event.title ?? "(New Event)"}</p>
        {arg.event.allDay ? (
          <p>{
            t("all-day")}</p>
        ) : (
          <p className="flex items-center gap-1 font-light">
            {arg.event.start
              ? DateTime.fromJSDate(arg.event.start).toFormat("h:mm a")
              : null}
            {arg.event.start && arg.event.end ? (
              <ChevronRight className="size-3" />
            ) : null}
            {arg.event.end
              ? DateTime.fromJSDate(arg.event.end).toFormat("h:mm a")
              : null}
          </p>
        )}
        <span className="vertical flex grow flex-col justify-end">
          <EventDetails services={services} />
        </span>
      </div>
    </div>
  );
}

export default function renderEventContent(arg: EventContentArg) {
  return (
    <EventContent
      arg={arg}
      isDayOff={arg.event.extendedProps.isDayOff as boolean}
    />
  );
}
