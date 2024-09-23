"use client";

import { DateTimePicker } from "@/components/datetime-input/datetime";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Event } from "@prisma/client";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  type UseBoolean,
  type UseStateful,
  useBoolean,
  useStateful,
} from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type DaysOffProps = {
  daysOff: Event[];
};

export default function DaysOff({ daysOff }: DaysOffProps) {
  const t = useTranslations("page.settings.tabs.schedule.days-off");
  const open = useBoolean(false);
  const edit = useStateful<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="vertical gap-2">
        <DayOffAdd open={open} disabled={edit.value !== null} />
        {daysOff.length === 0 && !open.value && (
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            {t("empty")}
          </div>
        )}
        {daysOff.map((dayOff) => (
          <DayOffItem
            key={dayOff.id}
            dayOff={dayOff}
            disabled={edit.value === dayOff.id || open.value}
            edit={edit}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function DayOffItem({
  dayOff,
  disabled,
  edit,
}: {
  dayOff: Event;
  disabled: boolean;
  edit: UseStateful<string | null>;
}) {
  const t = useTranslations("page.settings.tabs.schedule.days-off");
  const router = useRouter();
  const locale = useLocale();
  const { mutate: removeDayOff, isPending: removeIsPending } =
    api.appointment.removeDayOff.useMutation({
      onSuccess: () => {
        toast.success(t("actions.remove.status.success"));
        router.refresh();
        edit.setValue(null);
      },
    });

  const start = DateTime.fromJSDate(dayOff.start!).toFormat("dd LLLL yyyy", {
    locale,
  });

  const end = DateTime.fromJSDate(dayOff.end!).toFormat("dd LLLL yyyy", {
    locale,
  });

  return edit.value === dayOff.id ? (
    <DayOffEdit edit={edit} dayOff={dayOff} />
  ) : (
    <section className="px-4 py-2 rounded-md bg-accent border border-boderd horizontal justify-between">
      <span>
        <p className="font-medium">{dayOff.title}</p>
        <p className="text-muted-foreground text-sm">
          {start !== end ? `${start} - ${end}` : start}
        </p>
      </span>
      <span className="horizontal center-v gap-2">
        <Button
          size="icon"
          variant="destructive"
          type="button"
          disabled={disabled || removeIsPending}
          onClick={() => removeDayOff(dayOff.id)}
        >
          <Trash2 className="size-4" />
        </Button>
        <Button
          size="icon"
          type="button"
          disabled={disabled || removeIsPending}
          onClick={() => edit.setValue(dayOff.id)}
        >
          <Edit className="size-4" />
        </Button>
      </span>
    </section>
  );
}

const editSchema = z
  .object({
    title: z.string().optional(),
    start: z.date().optional(),
    end: z.date().optional(),
  })
  .superRefine(({ start, end }, ctx) => {
    if (start && end && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "date.start-after-end",
        path: ["start"],
      });
    }
  });

type EditValues = z.infer<typeof editSchema>;

function DayOffEdit({
  edit,
  dayOff,
}: {
  edit: UseStateful<string | null>;
  dayOff: Event;
}) {
  const t = useTranslations("page.settings.tabs.schedule.days-off");
  const router = useRouter();
  const { mutate: updateDayOff, isPending } =
    api.appointment.updateDayOff.useMutation({
      onSuccess: () => {
        toast.success(t("actions.add.status.success"));
        router.refresh();
        edit.setValue(null);
      },
    });

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: dayOff.title,
      start: dayOff.start!,
      end: dayOff.end!,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateDayOff({ ...data, id: edit.value! });
  });

  const handleClose = () => {
    form.reset();
    edit.setValue(null);
  };

  return (
    <section className="px-4 py-2 rounded-md bg-accent border border-boderd">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel htmlFor={field.name}>
                  {t("actions.add.form.title.label")}
                </FormLabel>
                <Input id={field.name} {...field} />
              </FormItem>
            )}
          />
          <span className="col-span-2 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor={field.name}>
                    {t("actions.add.form.date.label")}
                  </FormLabel>
                  <DateTimePicker
                    granularity="day"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-muted-foreground text-xs text-center pb-2">
              {t("actions.add.to")}
            </span>
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <DateTimePicker
                    granularity="day"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </span>
          <span className="horizontal center-v gap-2">
            <Button
              size="icon"
              variant="destructive"
              type="button"
              onClick={handleClose}
              disabled={isPending}
            >
              <X className="size-4" />
            </Button>
            <Button
              size="icon"
              type="submit"
              disabled={
                !form.formState.isDirty || !form.formState.isValid || isPending
              }
            >
              <Check className="size-4" />
            </Button>
          </span>
        </form>
      </Form>
    </section>
  );
}

const schema = z
  .object({
    title: z.string(),
    start: z.date(),
    end: z.date(),
  })
  .superRefine(({ start, end }, ctx) => {
    if (start && end && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "date.start-after-end",
        path: ["start"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function DayOffAdd({
  open,
  disabled,
}: { open: UseBoolean; disabled: boolean }) {
  const t = useTranslations("page.settings.tabs.schedule.days-off");
  const router = useRouter();
  const { mutate: addDayOff, isPending } =
    api.appointment.addDayOff.useMutation({
      onSuccess: () => {
        toast.success(t("actions.add.status.success"));
        form.reset();
        router.refresh();
        open.setFalse();
      },
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((data) => {
    addDayOff(data);
  });

  const handleClose = () => {
    form.reset();
    open.setFalse();
  };

  return open.value ? (
    <section className="px-4 py-2 rounded-md bg-accent border border-boderd">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel htmlFor={field.name}>
                  {t("actions.add.form.title.label")}
                </FormLabel>
                <Input id={field.name} {...field} />
              </FormItem>
            )}
          />
          <span className="col-span-2 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor={field.name}>
                    {t("actions.add.form.date.label")}
                  </FormLabel>
                  <DateTimePicker
                    granularity="day"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-muted-foreground text-xs text-center pb-2">
              {t("actions.add.to")}
            </span>
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <DateTimePicker
                    granularity="day"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </span>
          <span className="horizontal center-v gap-2">
            <Button
              size="icon"
              variant="destructive"
              type="button"
              onClick={handleClose}
              disabled={isPending}
            >
              <X className="size-4" />
            </Button>
            <Button
              size="icon"
              type="submit"
              disabled={
                !form.formState.isDirty || !form.formState.isValid || isPending
              }
            >
              <Check className="size-4" />
            </Button>
          </span>
        </form>
      </Form>
    </section>
  ) : (
    <Button
      className="ml-auto w-full sm:w-fit"
      onClick={open.setTrue}
      disabled={disabled}
      variant="expandIcon"
      Icon={Plus}
      iconPlacement="left"
    >
      {t("actions.add.label")}
    </Button>
  );
}
