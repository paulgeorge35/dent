import AvatarComponent from "@/components/shared/avatar-component";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import StatusBullet from "@/components/ui/status-bullet";
import { translations } from "@/lib/translations";
import type { Patient } from "@prisma/client";
import { StickyNote } from "lucide-react";
import { EventStatusSchema } from "prisma/generated/zod";
import { useMemo } from "react";
import type { z } from "zod";

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
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50">
            {Object.values(EventStatusSchema.Values).map((status) => (
              <SelectItem key={status} value={status} className="cursor-pointer hover:bg-muted">
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
        <Button
          variant="link"
          className="ml-auto text-link hover:text-link-hover"
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
