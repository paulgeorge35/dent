"use client";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayOfWeek } from "@prisma/client";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  firstDayOfWeek: z.nativeEnum(DayOfWeek),
  showWeekends: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function CalendarCustomization() {
  const t = useTranslations("page.settings.tabs.customization.calendar");
  const tError = useTranslations("errors");
  const { data: user } = api.user.me.useQuery();

  const updateCalendarSettings = api.user.updateCalendarSettings.useMutation({
    onSuccess: (data) => {
      toast.success(t("status.success"));
      form.reset({
        firstDayOfWeek: data.firstDayOfWeek,
        showWeekends: data.showWeekends,
      });
    },
    onError: (error) => {
      showErrorToast(error, tError);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstDayOfWeek: user?.firstDayOfWeek,
      showWeekends: user?.showWeekends,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateCalendarSettings.mutate(data);
  };

  useEffect(() => {
    form.reset({
      firstDayOfWeek: user?.firstDayOfWeek,
      showWeekends: user?.showWeekends,
    });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="vertical items-start gap-6"
          >
            <FormField
              control={form.control}
              name="firstDayOfWeek"
              render={({ field }) => (
                <FormItem className="min-w-[200px] max-w-full">
                  <FormLabel htmlFor={field.name}>
                    {t("first-day-of-week.label")}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={form.watch(field.name)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"MONDAY"}>
                        {t("first-day-of-week.options.monday")}
                      </SelectItem>
                      <SelectItem value={"SUNDAY"}>
                        {t("first-day-of-week.options.sunday")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showWeekends"
              render={({ field }) => (
                <FormItem>
                  <span className="horizontal center-v gap-2">
                    <FormLabel htmlFor={field.name}>
                      {t("show-weekends.label")}
                    </FormLabel>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </span>
                  <FormDescription>
                    {t("show-weekends.description")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              isLoading={updateCalendarSettings.isPending}
              disabled={
                !form.formState.isDirty || updateCalendarSettings.isPending
              }
              Icon={Save}
              variant="expandIcon"
              iconPlacement="left"
              type="submit"
              className="w-full sm:w-fit"
            >
              {t("button")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
