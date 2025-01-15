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
import useMediaQuery from "@/hooks/use-media-query";
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

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center gap-4">
        <span className="horizontal gap-4 center-v">
          <AvatarComponent
            alt={fullName}
            fallback={fullName}
            width={isDesktop ? 80 : 40}
            height={isDesktop ? 80 : 40}
            className="size-10 md:size-20 !text-2xl"
          />
          <span className="flex flex-col justify-around">
            <p className="text-sm text-muted-foreground">Patient name</p>
            <p className="text-lg md:text-2xl">{fullName}</p>
          </span>
        </span>
        <span className="md:ml-auto horizontal center-v gap-2">
          <p className="hidden md:block text-sm text-muted-foreground">
            Status
          </p>
          <Select value={eventStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              {Object.values(EventStatusSchema.Values).map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer hover:bg-muted"
                >
                  <span className="horizontal center-v gap-2">
                    <StatusBullet status={status} />
                    {translations.en.event.status[status]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </CardHeader>
      <Separator className="hidden md:block" />
      <CardFooter className="flex-row hidden md:flex items-center gap-4 !py-4 text-muted-foreground">
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
