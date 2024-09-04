"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import RootFormError from "@/components/ui/root-form-error";
import { PasswordInput } from "@/components/password-input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { showErrorToast } from "@/lib/handle-error";

const schema = z
  .object({
    firstName: z
      .string({
        required_error: "firstName.required",
        invalid_type_error: "firstName.invalid",
        description: "First name of the user",
      })
      .min(3, "firstName.min-length")
      .max(50, "firstName.max-length"),
    lastName: z
      .string({
        required_error: "lastName.required",
        invalid_type_error: "lastName.invalid",
        description: "Last name of the user",
      })
      .min(3, "lastName.min-length")
      .max(50, "lastName.max-length"),
    email: z
      .string({
        required_error: "email.required",
        invalid_type_error: "email.invalid",
        description: "Email of the user",
      })
      .email("email.invalid"),
    password: z
      .string({
        required_error: "password.required",
        invalid_type_error: "password.invalid",
        description: "Password of the user",
      })
      .min(8, "password.min-length")
      .max(64, "password.max-length")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "password.invalid-format"),
    confirm: z
      .string({
        required_error: "password.required",
        invalid_type_error: "password.invalid",
        description: "Confirm password of the user",
      })
      .min(8, "password.min-length")
      .max(64, "password.max-length")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "password.invalid-format"),
  })
  .superRefine(({ confirm, password }, ctx) => {
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "password.mismatch",
        path: ["confirm"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type RegisterFormProps = {
  email?: string;
};

export default function RegisterForm({ email }: RegisterFormProps) {
  const t = useTranslations("page.auth.sign-up");
  const te = useTranslations("errors");

  const { mutateAsync: register, isPending: pending } =
    api.user.register.useMutation({
      onSuccess: () => {
        toast.success(t("status.success.title"), {
          description: t("status.success.description"),
        });
      },
      onError: (error) => {
        showErrorToast(error, te);
      },
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: email ?? "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    await register(values);
  });

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>{t("firstName")}</FormLabel>
                <Input id={field.name} {...field} placeholder="John" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>{t("lastName")}</FormLabel>
                <Input id={field.name} {...field} placeholder="Doe" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>{t("email")}</FormLabel>
                <Input
                  id={field.name}
                  {...field}
                  type="email"
                  placeholder="john.doe@example.com"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>{t("password")}</FormLabel>
                <PasswordInput id={field.name} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            rules={{
              required: "Confirm password is required",
              validate: (value) =>
                value === form.getValues("password") ||
                "Passwords do not match",
            }}
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>
                  {t("confirm-password")}
                </FormLabel>
                <PasswordInput id={field.name} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <RootFormError error={form.formState.errors?.root?.message} />

        <Button isLoading={pending} type="submit" className="w-full">
          {t("button")}
        </Button>
      </form>
    </Form>
  );
}
