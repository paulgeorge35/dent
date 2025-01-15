"use client";

import { useAppointmentDialog } from "@/hooks/use-appointment-dialog";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type UpcommingProps = {
  appointments: {
    id: string;
    patient: string;
    phone: string | null;
    service?: string;
    duration?: number;
    date: Date | null;
  }[];
  className?: string;
};

export default function Upcomming({ appointments, className }: UpcommingProps) {
  const t = useTranslations("page.dashboard.upcomming");
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description", { count: appointments.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {appointments.map((appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentItem({
  appointment,
}: {
  appointment: {
    id: string;
    patient: string;
    phone: string | null;
    service?: string;
    duration?: number;
    date: Date | null;
  };
}) {
  const { openAppointmentDialog } = useAppointmentDialog();
  return (
    <button
      type="button"
      onClick={() => openAppointmentDialog(appointment.id)}
      className="horizontal center-v gap-2 p-4 rounded-md border border-input justify-between hover:bg-muted-foreground/10 transition-colors duration-300 ease-in-out">
      <span className="vertical gap-2">
        <span className="horizontal gap-2">
          <p className="font-medium">{appointment.patient}</p>
          <span className={cn({ "hidden": !appointment.phone })}>&bull;</span>
          <a
            href={`tel:${appointment.phone}`}
            className={cn(
              "text-link hover:underline hover:text-link-hover",
              {
                "hidden": !appointment.phone,
              },
            )}
          >
            {appointment.phone}
          </a>
        </span>
        <p className="text-sm text-muted-foreground border-muted-foreground rounded-full bg-muted w-min px-2 py-1">{appointment.service}</p>
      </span>
      <span className="vertical gap-2">
        <p className="font-medium">
          {DateTime.fromJSDate(appointment.date!).toFormat("h:mm a")}
        </p>
        <p className="text-sm text-muted-foreground">
          {appointment.duration} min
        </p>
      </span>
    </button>
  );
}
