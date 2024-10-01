"use client";

import { DateTimePicker } from "@/components/datetime-input/datetime";
import { TimePickerInput } from "@/components/datetime-input/time-picker";
import { DropzoneFiles } from "@/components/dropzone-input";
import AvatarComponent from "@/components/shared/avatar-component";
import { FormFieldCompact } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AppointmentSchema } from "../calendar";

type TreatmentSpecialistProps = {
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
};

export default function TreatmentSpecialist({
  form,
  resourceId,
}: TreatmentSpecialistProps) {
  const t = useTranslations("page.appointments.add.steps.treatment-specialist");
  const { data: services, isLoading: servicesLoading } =
    api.service.listSimpleServices.useQuery({});

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="serviceId"
        label={t("fields.treatment.label")}
        render={({ field }) => (
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn({
                "text-muted-foreground": !field.value,
              })}
              disabled={servicesLoading || services?.length === 0}
            >
              <SelectValue
                placeholder={
                  services?.length === 0
                    ? t("fields.treatment.empty")
                    : t("fields.treatment.placeholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <DentistCard userId={resourceId} date={form.watch("date")} />
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="date"
        label={t("fields.date.label")}
        required={false}
        render={({ field }) => (
          <span className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] gap-4 col-span-4 w-full">
            <DateTimePicker
              granularity="day"
              jsDate={field.value}
              onJsDateChange={field.onChange}
              className="col-span-2 md:col-span-1 w-full"
            />
            <FormFieldCompact
              control={form.control}
              name="start"
              required={false}
              render={({ field }) => (
                <span className="horizontal h-full items-end justify-end">
                  <TimePickerInput
                    picker="hours"
                    date={field.value}
                    setDate={field.onChange}
                    className="h-10 rounded-r-none"
                  />
                  <TimePickerInput
                    picker="minutes"
                    date={field.value}
                    setDate={field.onChange}
                    className="h-10 rounded-l-none"
                  />
                </span>
              )}
            />
            <FormFieldCompact
              control={form.control}
              name="end"
              required={false}
              render={({ field }) => (
                <span className="horizontal h-full items-end justify-between">
                  <span className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">to</p>
                    <span className="horizontal">
                      <TimePickerInput
                        picker="hours"
                        date={field.value}
                        setDate={field.onChange}
                        className="h-10 rounded-r-none"
                      />
                      <TimePickerInput
                        picker="minutes"
                        date={field.value}
                        setDate={field.onChange}
                        className="h-10 rounded-l-none"
                      />
                    </span>
                  </span>
                </span>
              )}
            />
          </span>
        )}
      />
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="description"
        label={t("fields.description.label")}
        required={false}
        render={({ field }) => (
          <Textarea
            {...field}
            charLimit={255}
            placeholder={t("fields.description.placeholder")}
            className="h-24 max-h-36"
          />
        )}
      />
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="files"
        label={t("fields.attachments.label")}
        required={false}
        render={({ field }) => (
          <DropzoneFiles
            className="horizontal col-span-4 w-full items-center justify-center gap-4 rounded-lg border border-input p-4 shadow-sm"
            wrapperClassName="w-full"
            accept={{
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "image/*": [".jpeg", ".png", ".jpg"],
            }}
            maxFiles={5}
            maxSize={10}
            {...field}
            id={field.name}
            value={form.watch(field.name)}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
    </div>
  );
}

type DentistCardProps = {
  userId: string;
  date: Date | null;
};

const DentistCard = ({ userId, date }: DentistCardProps) => {
  const t = useTranslations(
    "page.appointments.add.steps.treatment-specialist.fields.specialist",
  );
  const { data: user, isLoading: userLoading } = api.user.get.useQuery(userId);
  const { data: count, isLoading: countLoading } =
    api.appointment.count.useQuery(
      {
        date: date!,
        userId,
      },
      {
        enabled: !!date,
      },
    );

  const fullName = useMemo(() => {
    return `${user?.profile.title ? `${user.profile.title} ` : ""}${user?.profile.firstName} ${user?.profile.lastName}`;
  }, [user]);

  if (userLoading || !user || countLoading)
    return (
      <section className="vertical col-span-4 gap-3">
        <Label>{t("label")}</Label>
        <div className="flex items-center gap-4 rounded-lg border border-input p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </section>
    );

  return (
    <section className="vertical col-span-4 gap-3">
      <Label>{t("label")}</Label>
      <div className="flex items-center gap-4 rounded-lg border border-input p-4">
        <AvatarComponent
          src={user.profile.avatar?.url}
          alt={fullName}
          fallback={fullName}
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <span>
          <p className="text-sm font-medium">
            {fullName}
            <span className="text-muted-foreground">
              {user.speciality?.name}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {t("same-day-appointments")}
            <span className="font-bold">
              {count}{" "}
              {count === 1 ? t("patients.singular") : t("patients.plural")}
            </span>
          </p>
        </span>
      </div>
    </section>
  );
};
