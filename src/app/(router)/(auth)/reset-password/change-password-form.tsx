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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updatePassword } from "./actions";

const schema = z
  .object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
        description: "Password of the user",
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
  .superRefine(({ confirm, password }, ctx) => {
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

interface ChangePasswordFormProps {
  token: string;
}

export default function ChangePasswordForm({ token }: ChangePasswordFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    startTransition(async () => {
      try {
        await updatePassword(token, values.password);
      } catch (error) {
        if (error instanceof Error)
          form.setError("root", { message: error.message });
      }
    });
  });

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Password</FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirm"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
              <PasswordInput id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={pending} type="submit" className="col-span-2 w-full">
          Change Password
        </Button>
      </form>
    </Form>
  );
}
