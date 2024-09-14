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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z
    .string()
    .min(1, { message: "errors.global.required" })
    .max(1000, { message: "errors.global.max-length" }),
});

type FormValues = z.infer<typeof schema>;

export default function SupportForm() {
  const t = useTranslations("page.settings.tabs.support");
  const submitted = useBoolean(false);
  const { mutate: submitSupportTicket, isPending } =
    api.utils.submitSupportTicket.useMutation({
      onSuccess: () => {
        toast.success(t("status.success"));
        submitted.setTrue();
      },
    });

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit((data) => {
    submitSupportTicket(data);
  });

  return (
    <Card>
      {!submitted.value && (
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="vertical gap-4 pt-4">
        {submitted.value ? (
          <div>
            <h1 className="text-center text-2xl font-bold">
              {t("success-screen.title")}
            </h1>
            <p className="text-center text-sm text-muted-foreground text-balance">
              {t("success-screen.description")}
            </p>
            <CheckCircle className="mx-auto mt-4 size-10 text-green-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      {t("form.title.label")}
                    </FormLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder={t("form.title.placeholder")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      {t("form.description.label")}
                    </FormLabel>
                    <Textarea
                      id={field.name}
                      {...field}
                      placeholder={t("form.description.placeholder")}
                      charLimit={1000}
                      className="min-h-[200px] max-h-[400px]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                isLoading={isPending}
                disabled={
                  !form.formState.isDirty ||
                  !form.formState.isValid ||
                  isPending
                }
                Icon={Send}
                variant="expandIcon"
                iconPlacement="left"
                type="submit"
                className="col-span-2 sm:w-fit"
              >
                {t("button")}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
