"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin, {
  type EventResizeDoneArg,
  type DateClickArg,
} from "@fullcalendar/interaction";
import type {
  EventContentArg,
  EventClickArg,
  DateSelectArg,
  EventDropArg,
  DatesSetArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/handle-error";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import AppointmentDialog from "./appointment-dialog";
import { useBoolean } from "react-hanger";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import {
  renderEventContent,
  formatDayHeader,
  CalendarToolbar,
  resourceLabelContent,
} from "@/app/_components/calendar/util";

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

const selectedUserSchema = z.union([
  z.string(),
  z.literal("all"),
  z.literal("me"),
]);

interface CalendarProps {
  className?: string;
  selected?: z.infer<typeof selectedUserSchema>;
}

export default function Calendar({ selected = "me" }: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [period, setPeriod] = useState<"day" | "week">("day");
  const [selectedUser] = useState<z.infer<typeof selectedUserSchema>>(selected);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [, setRenderSeed] = useState(0);
  const [initialView] = useState("timeGridWeek");
  const appoinmentDialog = useBoolean(false);
  const router = useRouter();
  const { data: users } = api.tenant.calendar.useQuery({
    selected: selectedUser,
    dateRange,
  });

  useEffect(() => {
    const calendar = calendarRef.current?.getApi();
    if (!calendar) return;
    if (selectedUser === "all") {
      calendar.changeView("resourceTimelineDay");
    } else {
      calendar.changeView(period === "day" ? "timeGridDay" : "timeGridWeek");
    }
  }, [period, selectedUser]);

  const appointments = useMemo(() => {
    return users?.flatMap((user) => user.events) ?? [];
  }, [users]);

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
      patientId: appointment?.patient?.id,
      firstName: appointment?.patient?.firstName,
      lastName: appointment?.patient?.lastName,
      email: appointment?.patient?.email ?? undefined,
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

  const styleEvent = (arg: EventContentArg) => {
    const event = appointments.find((app) => app.id === arg.event.id);
    return cn(
      "rounded-lg",
      "bg-teal-400 hover:bg-teal-600",
      (!event || !event.status) &&
        "bg-teal-400/20 hover:bg-teal-400/20 border-dashed border-border",
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

  useEffect(() => {
    setTimeout(() => {
      setRenderSeed(Math.random() * 1000000);
    }, 300);
  }, [sidebar?.isOpen, initialView]);

  const memoizedAppointments: EventSourceInput = useMemo(() => {
    return appointments.map((app) => ({
      ...app,
      title: app.patient?.firstName + " " + app.patient?.lastName,
      start: app.start ?? undefined,
      end: app.end ?? undefined,
      resourceId: app.userId,
      constraints: {
        resourceIds: [app.userId],
        businessHours: {
          startTime: "18:00",
          endTime: "10:00",
        },
      },
    }));
  }, [appointments]);

  return (
    <>
      <CalendarToolbar
        period={period}
        selectedUser={selectedUser}
        setPeriod={setPeriod}
        calendarRef={calendarRef}
        users={users}
      />
      {/* <AppointmentDialog
        open={appoinmentDialog.value}
        onOpenChange={(value) => appoinmentDialog.setValue(value)}
        form={form}
      /> */}
      <FullCalendar
        ref={calendarRef}
        schedulerLicenseKey="0654377132-fcs-1723569352"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimeGridPlugin,
          resourceTimelinePlugin,
        ]}
        headerToolbar={{
          left: "",
          center: "",
          right: "",
        }}
        datesSet={useCallback((arg: DatesSetArg) => {
          setDateRange((prevRange) => {
            if (
              prevRange?.start.getTime() === arg.start.getTime() &&
              prevRange?.end.getTime() === arg.end.getTime()
            ) {
              return prevRange;
            }
            return { start: arg.start, end: arg.end };
          });
        }, [])}
        datesAboveResources={true}
        dateClick={handleDateClick}
        select={handleSelect}
        eventDrop={handleDrop}
        eventClick={handleEventClick}
        eventResize={handleEventResize}
        initialView={initialView}
        resources={users?.map((user) => ({
          id: user.id,
          title: user.profile.firstName + " " + user.profile.lastName,
          businessHours: {
            startTime: "10:00",
            endTime: "18:00",
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          },
          extendedProps: {
            userId: user.id,
            tenantId: user.tenantId,
          },
        }))}
        resourceLabelContent={(arg) =>
          resourceLabelContent(
            users?.find(
              (user) =>
                user.id === (arg.resource.extendedProps.userId as string),
            ),
          )
        }
        eventContent={renderEventContent}
        selectMirror
        unselectAuto={false}
        eventClassNames={styleEvent}
        events={memoizedAppointments}
        editable={true}
        scrollTimeReset={false}
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
        // buttonText={{
        //   today: "Today",
        //   month: "Month",
        //   week: "Week",
        //   day: "Day",
        //   resourceDayGridDay: "Room Day",
        //   resourceTimelineDay: "All Dentists",
        // }}
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
        now={DateTime.local().toJSDate()}
        titleFormat={{
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          omitCommas: true,
        }}
      />
    </>
  );
}
