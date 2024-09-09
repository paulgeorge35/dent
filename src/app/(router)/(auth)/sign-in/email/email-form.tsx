"use client";

import { PasswordInput } from "@/components/password-input";
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
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "./actions";

const schema = z.object({
  email: z.string().min(1, "email.required").email("email.invalid"),
  password: z.string().min(1, "password.required"),
});

type FormValues = z.infer<typeof schema>;

export default function EmailSignIn() {
  const t = useTranslations("page.auth.sign-in.with-password");
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    startTransition(async () => {
      try {
        await signIn(values.email, values.password);
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", { message: error.message });
        }
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
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <div className="flex items-center">
                <FormLabel htmlFor="password">{t("password")}</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  {t("forgot-password")}
                </Link>
              </div>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <RootFormError
          className="col-span-2"
          error={form.formState.errors?.root?.message}
        />

        <Button isLoading={pending} type="submit" className="col-span-2 w-full">
          {t("button")}
        </Button>
      </form>
    </Form>
  );
}
