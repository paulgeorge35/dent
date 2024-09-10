"use client";

import { TimePickerInput } from "@/components/datetime-input/time-picker";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormFieldCompact,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import RootFormError from "@/components/ui/root-form-error";
import { Switch } from "@/components/ui/switch";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { WorkingHours } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { useStateful } from "react-hanger";
import { type UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type WorkingHoursProps = {
  workingHours: WorkingHours[];
  sunday?: boolean;
};

const schema = z.object({
  workingHours: z.array(
    z.object({
      startTime: z.date().nullable(),
      endTime: z.date().nullable(),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

export default function WorkingHoursComponent({
  workingHours,
  sunday = false,
}: WorkingHoursProps) {
  const transformWorkingHours = (workingHours: WorkingHours[]) => {
    return Array.from({ length: 7 }, (_, index) => {
      const isWorking = workingHours.find((workingHour) =>
        workingHour.daysOfWeek.includes(index),
      );
      if (isWorking) {
        return {
          startTime: DateTime.fromISO(isWorking.startTime).toJSDate(),
          endTime: DateTime.fromISO(isWorking.endTime).toJSDate(),
        };
      }
      return {
        startTime: null,
        endTime: null,
      };
    });
  };

  const t = useTranslations("page.settings.tabs.schedule.working-hours");
  const te = useTranslations("errors");
  const transformedWorkingHours = useStateful(
    transformWorkingHours(workingHours),
  );
  const updateWorkingHours = api.user.updateWorkingHours.useMutation({
    onSuccess: (data) => {
      toast.success(t("status.success"));
      form.reset({
        workingHours: transformedWorkingHours.value,
      });
    },
    onError: (error) => {
      showErrorToast(error, te);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      workingHours: transformedWorkingHours.value,
    },
  });

  const onSubmit = (values: FormValues) => {
    const data = values.workingHours
      .map((day, index) => {
        const isWorking = !!day.endTime && !!day.startTime;
        if (isWorking) {
          return {
            daysOfWeek: [index],
            startTime: DateTime.fromJSDate(day.startTime!).toFormat("HH:mm"),
            endTime: DateTime.fromJSDate(day.endTime!).toFormat("HH:mm"),
          };
        }
      })
      .filter((day) => day !== undefined);
    updateWorkingHours.mutate(data);
  };

  const { fields } = useFieldArray({
    control: form.control,
    name: "workingHours",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) =>
          !sunday && index === 0 ? null : (
            <WorkingDay key={field.id} form={form} day={index} />
          ),
        )}
        {!sunday && <WorkingDay key={0} form={form} day={0} />}
        <RootFormError
          className="col-span-2"
          error={form.formState.errors.root?.message}
        />
        <Button
          isLoading={updateWorkingHours.isPending}
          disabled={!form.formState.isDirty || updateWorkingHours.isPending}
          Icon={Save}
          variant="expandIcon"
          iconPlacement="left"
          type="submit"
          className="col-span-2 sm:w-fit"
        >
          {t("button")}
        </Button>
      </form>
    </Form>
  );
}

type WorkingDayProps = {
  day: number;
  form: UseFormReturn<FormValues>;
};

function WorkingDay({ day, form }: WorkingDayProps) {
  const isWorking =
    !!form.watch(`workingHours.${day}.endTime`) &&
    !!form.watch(`workingHours.${day}.startTime`);
  const t = useTranslations("page.settings.tabs.schedule.working-hours");
  return (
    <div
      className={cn(
        "grid grid-cols-[200px_1fr] gap-2 p-4 [&:not(:first-child)]:border-t",
      )}
    >
      <FormField
        control={form.control}
        name={`workingHours.${day}`}
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <Switch
              id={`working-day-${day}`}
              checked={isWorking}
              onCheckedChange={() =>
                field.onChange({
                  startTime: isWorking
                    ? null
                    : DateTime.fromObject({ hour: 8 }).toJSDate(),
                  endTime: isWorking
                    ? null
                    : DateTime.fromObject({ hour: 17 }).toJSDate(),
                })
              }
            />
            <FormLabel htmlFor={`working-day-${day}`}>
              {t(`days-of-week.${day}`)}
            </FormLabel>
          </FormItem>
        )}
      />
      {!isWorking && (
        <p className="h-10 flex items-center col-span-1 text-sm text-muted-foreground">
          {t("not-working")}
        </p>
      )}
      {isWorking && (
        <span className="horizontal gap-4">
          <FormFieldCompact
            control={form.control}
            name={`workingHours.${day}.startTime`}
            required={false}
            render={({ field }) => (
              <span className="horizontal h-full  items-end justify-end">
                <TimePickerInput
                  picker="hours"
                  date={field.value ?? undefined}
                  setDate={(date) => field.onChange(date)}
                  className="h-10 rounded-r-none"
                />
                <TimePickerInput
                  picker="minutes"
                  date={field.value ?? undefined}
                  setDate={(date) => field.onChange(date)}
                  className="h-10 rounded-l-none"
                />
              </span>
            )}
          />

          <FormFieldCompact
            control={form.control}
            name={`workingHours.${day}.endTime`}
            required={false}
            render={({ field }) => (
              <span className="horizontal h-full  items-end justify-end">
                <TimePickerInput
                  picker="hours"
                  date={field.value ?? undefined}
                  setDate={(date) => field.onChange(date)}
                  className="h-10 rounded-r-none"
                />
                <TimePickerInput
                  picker="minutes"
                  date={field.value ?? undefined}
                  setDate={(date) => field.onChange(date)}
                  className="h-10 rounded-l-none"
                />
              </span>
            )}
          />
        </span>
      )}
    </div>
  );
}
