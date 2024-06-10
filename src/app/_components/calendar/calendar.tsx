"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type EventResizeDoneArg,
  type DateClickArg,
} from "@fullcalendar/interaction";
import {
  type EventContentArg,
  type EventClickArg,
  type DayHeaderContentArg,
  type DateSelectArg,
  type EventDropArg,
} from "@fullcalendar/core/index.js";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import type { Event, Patient } from "prisma/generated/zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/handle-error";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AppointmentDialog from "./appointment-dialog";
import { useBoolean } from "react-hanger";

const schema = z
  .object({
    id: z.string().nullish(),
    patientId: z.string().nullish(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(1, "Phone number is required").nullish(),
    description: z.string().nullish(),
    date: z.date(),
    allDay: z.boolean().default(false),
    start: z.date().nullish(),
    end: z.date().nullish(),
  })
  .superRefine(({ start, end, allDay }, ctx) => {
    if (start && end && start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event must end after it starts",
        path: ["end"],
      });
    }
    if (!allDay && !start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time is required",
        path: ["start"],
      });
    }
    if (!allDay && !end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time is required",
        path: ["end"],
      });
    }
  });

export type AppointmentSchema = z.infer<typeof schema>;

interface CalendarProps {
  appointments: (Event & {
    notified: boolean;
    patient: Patient;
  })[];
}

export default function Calendar({ appointments }: CalendarProps) {
  const appoinmentDialog = useBoolean(false);
  const router = useRouter();
  const { mutate } = api.appointment.update.useMutation({
    onMutate: (data) => {
      const appointment = appointments.find((app) => app.id === data.id);
      if (!appointment) return;

      appointment.start = data.start ?? null;
      appointment.end = data.end ?? null;
      appointment.allDay = data.allDay ?? false;
      appointment.date = data.date;
    },
    onSuccess: () => {
      toast.success("Appointment updated");
      router.refresh();
    },
    onError: (err) => {
      showErrorToast(err);
      router.refresh();
    },
  });

  const handleDrop = (arg: EventDropArg) => {
    if (!arg.event.start) return;

    mutate({
      id: arg.event.id,
      date: arg.event.start,
      allDay: arg.event.allDay,
      start: arg.event.start,
      end: arg.event.end,
    });
  };

  const handleEventResize = (arg: EventResizeDoneArg) => {
    if (!arg.event.start) return;

    mutate({
      id: arg.event.id,
      date: arg.event.start,
      allDay: arg.event.allDay,
      start: arg.event.start,
      end: arg.event.end,
    });
  };

  const handleDateClick = (arg: DateClickArg) => {
    appoinmentDialog.setValue(true);
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
      date: arg.date,
      start: arg.allDay ? null : arg.date,
      end: arg.allDay
        ? null
        : DateTime.fromJSDate(arg.date).plus({ hours: 1 }).toJSDate(),
    });
  };

  const handleEventClick = (arg: EventClickArg) => {
    appoinmentDialog.setValue(true);
    const appointment = appointments.find((app) => app.id === arg.event.id);
    form.reset({
      id: arg.event.id,
      patientId: appointment?.patient.id,
      firstName: appointment?.patient.firstName,
      lastName: appointment?.patient.lastName,
      email: appointment?.patient.email ?? undefined,
      date: appointment?.date,
      allDay: arg.event.allDay,
      start: arg.event.start,
      end: arg.event.end,
    });
  };

  const handleSelect = (arg: DateSelectArg) => {
    appoinmentDialog.setValue(true);
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
      allDay: arg.allDay,
      date: arg.start,
      start: arg.start,
      end: arg.end,
    });
  };

  const formatDayHeader = (arg: DayHeaderContentArg) => {
    if (arg.view.type === "timeGridDay")
      if (arg.isToday)
        return <p className={cn("text-xs font-normal")}>Today</p>;
      else
        return (
          <p className={cn("text-xs font-normal")}>
            {DateTime.fromJSDate(arg.date).toFormat("ccc, LLL d")}
          </p>
        );
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
  };

  const styleEvent = (arg: EventContentArg) => {
    const event = appointments.find((app) => app.id === arg.event.id);
    return cn(
      "rounded-lg",
      "bg-teal-400 hover:bg-teal-600",
      (!event || !event.status) &&
        "bg-teal-400/20 hover:bg-teal-400/20 border-dashed border-border",
    );
  };

  const renderEventContent = (arg: EventContentArg) => {
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
  };

  const form = useForm<AppointmentSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
      start: DateTime.now().set({ second: 0, millisecond: 0 }).toJSDate(),
      end: null,
    },
  });

  return (
    <>
      <AppointmentDialog
        open={appoinmentDialog.value}
        onOpenChange={(value) => appoinmentDialog.setValue(value)}
        form={form}
      />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dateClick={handleDateClick}
        select={handleSelect}
        eventDrop={handleDrop}
        eventClick={handleEventClick}
        eventResize={handleEventResize}
        initialView="timeGridWeek"
        eventContent={renderEventContent}
        selectMirror
        // unselectAuto={false}
        eventClassNames={styleEvent}
        events={appointments.map((app) => ({
          ...app,
          title: app.patient.firstName + " " + app.patient.lastName,
          start: app.start ?? undefined,
          end: app.end ?? undefined,
        }))}
        editable={true}
        slotDuration={{ minutes: 10 }}
        slotLabelInterval={{ hours: 1 }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          hour12: false,
        }}
        allDayText="All Day"
        allDaySlot={true}
        dayHeaders={true}
        dayHeaderFormat={{
          weekday: "short",
          month: "numeric",
          day: "numeric",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        dayCellClassNames={"hover:bg-blue-600/10"}
        navLinks={true}
        // locale={"ro-RO"}
        dayMaxEventRows={1}
        dayHeaderContent={formatDayHeader}
        // weekends={false}
        firstDay={1}
        nowIndicator={true}
        selectable={true}
        scrollTime={{ hour: DateTime.local().hour }}
        // now={DateTime.local().toJSDate()}
        views={{
          dayGrid: {},
          timeGrid: {},
          week: {},
          day: {},
        }}
      />
    </>
  );
}
