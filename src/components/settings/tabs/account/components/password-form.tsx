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

const schema = z
  .object({
    current: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
      description: "Password of the user",
    }),
    password: z
      .string({
        required_error: "Confirm password is required",
        invalid_type_error: "Confirm password must be a string",
        description: "Confirm password of the user",
      })
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Passwords must contain at least one lowercase letter, one uppercase letter, and one number.",
      ),
    confirm: z
      .string({
        required_error: "Confirm password is required",
        invalid_type_error: "Confirm password must be a string",
        description: "Confirm password of the user",
      })
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Passwords must contain at least one lowercase letter, one uppercase letter, and one number.",
      ),
  })
  .superRefine(({ password, confirm }, ctx) => {
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function PasswordForm() {
  const router = useRouter();
  const { mutate, isPending } = api.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully.");
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
          rules={{
            required: "Password is required",
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Current Password</FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>New Password</FormLabel>
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
              value === form.getValues("password") || "Passwords do not match",
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root?.message && (
          <RootFormError
            className="col-span-2"
            error={form.formState.errors.root.message}
          />
        )}
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
