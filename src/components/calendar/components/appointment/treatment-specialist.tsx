"use client";

import type { UseFormReturn } from "react-hook-form";
import type { AppointmentSchema } from "../calendar";
import { FormFieldCompact } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { Textarea } from "@/components/ui/textarea";
import AvatarComponent from "@/components/shared/avatar-component";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/datetime-input/datetime";
import { TimePickerInput } from "@/components/datetime-input/time-picker";
import { DropzoneFiles } from "@/components/dropzone-input";

type TreatmentSpecialistProps = {
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
};

export default function TreatmentSpecialist({
  form,
  resourceId,
}: TreatmentSpecialistProps) {
  const { data: services, isLoading: servicesLoading } =
    api.service.list.useQuery({ type: "SINGLE" });

  return (
    <div className="grid grid-cols-4 gap-4 px-4">
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="serviceId"
        label="Treatment"
        render={({ field }) => (
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger disabled={servicesLoading || services?.length === 0}>
              <SelectValue
                placeholder={
                  services?.length === 0
                    ? "No treatments available"
                    : "Select Treatment"
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
        label="Date & Time"
        required={false}
        render={({ field }) => (
          <span className="horizontal gap-4">
            <DateTimePicker
              granularity="day"
              jsDate={field.value}
              onJsDateChange={field.onChange}
            />
            <FormFieldCompact
              className="col-span-1"
              control={form.control}
              name="start"
              required={false}
              render={({ field }) => (
                <span className="horizontal h-full  items-end justify-end">
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
              className="col-span-1"
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
        label="Quick Notes"
        required={false}
        render={({ field }) => (
          <Textarea
            {...field}
            charLimit={255}
            placeholder="Type a message..."
            className="h-24 max-h-36"
          />
        )}
      />
      <FormFieldCompact
        className="col-span-4"
        control={form.control}
        name="files"
        label="Attachments"
        required={false}
        render={({ field }) => (
          <DropzoneFiles
            className="horizontal col-span-4 items-center justify-center gap-4 rounded-lg border border-input p-4 shadow-sm"
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
  date: Date;
};

const DentistCard = ({ userId, date }: DentistCardProps) => {
  const { data: user, isLoading: userLoading } = api.user.get.useQuery(userId);
  const { data: count, isLoading: countLoading } =
    api.appointment.count.useQuery({
      date,
      userId,
    });
  if (userLoading || !user || countLoading)
    return (
      <section className="vertical col-span-4 gap-3">
        <Label>Dentist</Label>
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
      <Label>Dentist</Label>
      <div className="flex items-center gap-4 rounded-lg border border-input p-4">
        <AvatarComponent
          src={user.profile.avatar?.url}
          alt={`${user.profile.firstName} ${user.profile.lastName}`}
          fallback={`${user.profile.firstName} ${user.profile.lastName}`}
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <span>
          <p className="text-sm font-medium">
            {user.profile.title} {user.profile.firstName}{" "}
            {user.profile.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            Same day appointments:{" "}
            <span className="font-bold">{count} patient(s)</span>
          </p>
        </span>
      </div>
    </section>
  );
};
