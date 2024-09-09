import { cn } from "@/lib/utils";
import { Clock, Pill, Stethoscope } from "lucide-react";

type AppointmentDetailsCardProps = {
  treatment: string;
  date: string;
  time: string;
  doctor: string;
  className?: string;
};

export default function AppointmentDetailsCard({
  treatment,
  date,
  time,
  doctor,
  className,
}: AppointmentDetailsCardProps) {
  return (
    <span className={cn("grid grid-cols-3", className)}>
      <Section title="Treatment" value={treatment} Icon={Pill} />
      <Section
        title="Date & Time"
        value={date}
        secondValue={time}
        Icon={Clock}
      />
      <Section title="Dentist" value={doctor} Icon={Stethoscope} />
    </span>
  );
}

type SectionProps = {
  title: string;
  value: string;
  secondValue?: string;
  Icon: React.ElementType;
};

function Section({ title, value, secondValue, Icon }: SectionProps) {
  return (
    <span className="flex flex-row items-start gap-2">
      <Icon className="size-11 rounded-lg bg-muted p-2 text-muted-foreground" />
      <div className="flex flex-col gap-2 ">
        <p className="text-xs uppercase text-muted-foreground">{title}</p>
        <p className="text-balance text-sm font-medium">
          {value}
          {secondValue && (
            <span className="!font-normal block">{secondValue}</span>
          )}
        </p>
      </div>
    </span>
  );
}
