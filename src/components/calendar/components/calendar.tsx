"use client";

import {
  CalendarToolbar,
  formatDayHeader,
  renderEventContent,
  resourceLabelContent,
} from "@/components/calendar/util";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type WorkingHours, appointmentCreateInput } from "@/types/schema";
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
  type EventResizeDoneArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DayOfWeek, EventType } from "@prisma/client";
import { Bell } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBoolean, useInput } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AppointmentDialog from "./appointment-dialog";
import CreateAppointmentDialog from "./create-appointment-dialog";

export type AppointmentSchema = z.infer<typeof appointmentCreateInput>;

const selectedUserSchema = z.union([
  z.string(),
  z.literal("all"),
  z.literal("me"),
]);

interface CalendarProps {
  userId: string;
  isAdmin: boolean;
  className?: string;
  selected?: z.infer<typeof selectedUserSchema>;
  firstDayOfWeek: DayOfWeek;
  showWeekends: boolean;
  workingHours: WorkingHours[];
}

export default function Calendar({
  userId,
  selected = "me",
  isAdmin,
  firstDayOfWeek,
  showWeekends,
  workingHours,
}: CalendarProps) {
  const locale = useLocale();
  const t = useTranslations("page.appointments.calendar");
  const calendarRef = useRef<FullCalendar>(null);
  const calendar = calendarRef.current?.getApi();
  const [period, setPeriod] = useState<"day" | "week">("day");
  const [selectedUser] = useState<z.infer<typeof selectedUserSchema>>(selected);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const [resourceId, setResourceId] = useState<string>(userId);
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [, setRenderSeed] = useState(0);
  const [initialView] = useState("timeGridWeek");
  const newAppointmentDialog = useBoolean(false);
  const openAppointmentDialog = useInput(undefined);
  const router = useRouter();
  const { data: activeUsers } = api.tenant.activeUsers.useQuery();
  const { data: users, refetch: refetchCalendar } =
    api.tenant.calendar.useQuery({
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
      toast.custom((t) => (
        <div className="bg-background shadow-md p-4 rounded-md horizontal center-v gap-2">
          <p className="text-sm w-fit whitespace-nowrap">
            Appointment rescheduled
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.loading("Sending confirmation email...")}
          >
            <Bell className="size-4 mr-2" />
            Request confirmation
          </Button>
        </div>
      ));
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
    const resourceId = !["me", "all"].includes(selected) ? selected : (arg.resource?.id ?? userId);
    if (!isAdmin && resourceId !== userId) return;
    newAppointmentDialog.setValue(true);
    setResourceId(resourceId);
    form.reset({
      description: "",
      date: arg.date,
      start: arg.allDay ? undefined : arg.date,
      end: arg.allDay
        ? undefined
        : DateTime.fromJSDate(arg.date).plus({ hours: 1 }).toJSDate(),
    });
  };

  const handleEventClick = (arg: EventClickArg) => {
    if (arg.event.extendedProps.isDayOff) return;
    const appointment = appointments.find((app) => app.id === arg.event.id);
    if (!isAdmin && appointment?.userId !== userId) return;
    openAppointmentDialog.setValue(arg.event.id);
    setResourceId(appointment?.userId ?? userId);
  };

  const handleSelect = (arg: DateSelectArg) => {
    const resourceId = !["me", "all"].includes(selected) ? selected : (arg.resource?.id ?? userId);
    if (!isAdmin && resourceId !== userId) return;
    newAppointmentDialog.setValue(true);
    setResourceId(resourceId);
    form.reset({
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
      "rounded-lg overflow-hidden",
      {
        "bg-teal-200/30 hover:bg-teal-200/50": event?.status === "CREATED",
        "bg-red-200/30 hover:bg-red-200/50": event?.status === "CANCELLED",
        "bg-blue-200/30 hover:bg-blue-200/50": event?.status === "CONFIRMED",
        "bg-green-200/30 hover:bg-green-200/50": event?.status === "COMPLETED",
        "bg-yellow-200/30 hover:bg-yellow-200/50": event?.status === "RESCHEDULED",
        "bg-primary/10": !arg.event.id,
        "bg-background/20 hover:bg-background/20 border-background/40 border-dashed":
          event?.type === EventType.DAY_OFF,
      },
    );
  };

  const form = useForm<AppointmentSchema>({
    resolver: zodResolver(appointmentCreateInput),
    defaultValues: {
      description: "",
      start: DateTime.now().set({ second: 0, millisecond: 0 }).toJSDate(),
      end: undefined,
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
      editable: app.type === EventType.APPOINTMENT && (isAdmin || app.userId === userId),
      title:
        app.type === EventType.APPOINTMENT
          ? `${app.patient?.firstName} ${app.patient?.lastName}`
          : app.title,
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
      extendedProps: {
        isDayOff: app.type === EventType.DAY_OFF,
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
        activeUsers={activeUsers?.filter((user) => user.id !== userId)}
      />
      <CreateAppointmentDialog
        open={newAppointmentDialog.value}
        resourceId={resourceId}
        onOpenChange={(value) => {
          newAppointmentDialog.setValue(value);
          calendar?.unselect();
        }}
        form={form}
        refetch={refetchCalendar}
      />
      <AppointmentDialog
        open={openAppointmentDialog.value !== ""}
        eventId={openAppointmentDialog.value}
        onClose={() => openAppointmentDialog.clear()}
      />
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
          title: `${user.profile.firstName} ${user.profile.lastName}`,
          businessHours:
            (user.workingHours as EventInput[]).length > 0
              ? (user.workingHours as EventInput[])
              : [
                  {
                    startTime: "00:00",
                    endTime: "00:00",
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                  },
                ],
          extendedProps: {
            userId: user.id,
            tenantId: user.tenantId,
          },
        }))}
        resourceAreaHeaderContent={t("resources")}
        resourceLabelContent={(arg) =>
          resourceLabelContent(
            t,
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
        allDayText={t("all-day")}
        allDaySlot={true}
        dayHeaders={true}
        dayHeaderFormat={{
          weekday: "short",
          month: "numeric",
          day: "numeric",
        }}
        businessHours={
          workingHours.length > 0
            ? workingHours
            : [
                {
                  startTime: "00:00",
                  endTime: "00:00",
                  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                },
              ]
        }
        dayCellClassNames={"hover:bg-blue-600/10"}
        navLinks={true}
        locale={locale}
        dayMaxEventRows={2}
        dayHeaderContent={(arg) => formatDayHeader(t, locale, arg)}
        weekends={showWeekends}
        firstDay={firstDayOfWeek === "MONDAY" ? 1 : 0}
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
