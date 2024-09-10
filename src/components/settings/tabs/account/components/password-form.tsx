"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RootFormError from "@/components/ui/root-form-error";

import { PasswordInput } from "@/components/password-input";
import { getErrorMessage } from "@/lib/handle-error";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

const schema = z
  .object({
    current: z.string({
      required_error: "password.required",
      invalid_type_error: "password.invalid",
      description: "Password of the user",
    }),
    password: z
      .string({
        required_error: "password.required",
        invalid_type_error: "password.invalid",
        description: "Confirm password of the user",
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
  .superRefine(({ password, confirm }, ctx) => {
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "password.mismatch",
        path: ["confirm"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function PasswordForm() {
  const t = useTranslations("page.settings.tabs.account.password");
  const router = useRouter();
  const { mutate, isPending } = api.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      router.refresh();
      form.reset({
        current: "",
        password: "",
        confirm: "",
      });
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        form.setError("root", {
          type: "validate",
          message: getErrorMessage(error),
        });
      }
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutate(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid grid-cols-2 items-start gap-6">
        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>
                {t("current-password")}
              </FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("new-password")}</FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
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
        <RootFormError
          className="col-span-2"
          error={form.formState.errors.root?.message}
        />
        <Button
          isLoading={isPending}
          disabled={!form.formState.isDirty}
          Icon={Save}
          variant="expandIcon"
          iconPlacement="left"
          type="submit"
          className="col-span-2 sm:w-fit"
        >
          Update password
        </Button>
      </form>
    </Form>
  );
}
