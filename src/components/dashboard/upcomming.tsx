import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
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
    service?: string;
    duration?: number;
    date: Date | null;
  }[];
  className?: string;
};

export default function Upcomming({ appointments, className }: UpcommingProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Upcomming appointments</CardTitle>
        <CardDescription>
          You have {appointments.length} appointments left today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
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
    service?: string;
    duration?: number;
    date: Date | null;
  };
}) {
  return (
    <div className="horizontal center-v gap-2 p-4 rounded-md border border-input justify-between">
      <span className="vertical gap-2">
        <p className="font-medium">{appointment.patient}</p>
        <p className="text-sm text-muted-foreground">{appointment.service}</p>
      </span>
      <span className="vertical gap-2">
        <p className="font-medium">
          {DateTime.fromJSDate(appointment.date!).toFormat("h:mm a")}
        </p>
        <p className="text-sm text-muted-foreground">
          {appointment.duration} minutes
        </p>
      </span>
    </div>
  );
}
