"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RootFormError from "@/components/ui/root-form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendResetPasswordEmail } from "./actions";

const schema = z.object({
  email: z.string().min(1, "email.required").email("email.invalid"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const t = useTranslations("page.auth.forgot-password");
  const emailSent = useBoolean(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    startTransition(async () => {
      try {
        await sendResetPasswordEmail(values.email);
        emailSent.setTrue();
      } catch (error) {
        if (error instanceof Error)
          form.setError("root", { message: error.message });
        emailSent.setFalse();
      }
    });
  });

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("email")}</FormLabel>
              <Input
                id={field.name}
                type="email"
                {...field}
                placeholder="john.doe@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <RootFormError error={form.formState.errors?.root?.message} />

        <Button
          disabled={emailSent.value}
          isLoading={pending}
          type="submit"
          className="col-span-2 w-full"
        >
          {emailSent.value ? t("email-sent") : t("button")}
        </Button>
      </form>
    </Form>
  );
}
