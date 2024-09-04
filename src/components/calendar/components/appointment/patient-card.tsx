import AvatarComponent from "@/components/shared/avatar-component";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient } from "@prisma/client";
import { useMemo } from "react";
import { EventStatusSchema } from "prisma/generated/zod";
import type { z } from "zod";
import { translations } from "@/lib/translations";
import StatusBullet from "@/components/ui/status-bullet";
import { Separator } from "@/components/ui/separator";
import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

type PatientCardProps = {
  patient: Patient;
  status: z.infer<typeof EventStatusSchema>;
  description: string | null;
};

export default function PatientCard({
  patient,
  status: eventStatus,
  description,
}: PatientCardProps) {
  const fullName = useMemo(() => {
    return `${patient.firstName} ${patient.lastName}`;
  }, [patient]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <AvatarComponent
          alt={fullName}
          fallback={fullName}
          width={80}
          height={80}
          className="size-20 !text-2xl"
        />
        <span className="flex flex-col justify-around">
          <p className="text-sm text-muted-foreground">Patient name</p>
          <p className="text-2xl">{fullName}</p>
        </span>
        <p className="ml-auto text-sm text-muted-foreground">Status</p>
        <Select value={eventStatus}>
          <SelectTrigger className="w-40">
            <span className="horizontal center-v gap-2">
              <StatusBullet status={eventStatus} />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {Object.values(EventStatusSchema.Values).map((status) => (
              <SelectItem key={status} value={status}>
                <span className="horizontal center-v gap-2">
                  <StatusBullet status={status} />
                  {translations.en.event.status[status]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <Separator />
      <CardFooter className="flex flex-row items-center gap-4 !py-4 text-muted-foreground">
        <StickyNote className="size-6" />
        <p className="text-sm">
          {description ? description : "No observations"}
        </p>
        <Button variant="link" className="ml-auto text-link hover:text-link-hover">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
