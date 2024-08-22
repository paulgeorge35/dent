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
// import { signUp } from "./actions";
import RootFormError from "@/components/ui/root-form-error";
import { PasswordInput } from "@/components/password-input";

const schema = z
  .object({
    firstName: z
      .string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
        description: "First name of the user",
      })
      .min(3, "First name must be at least 3 characters")
      .max(50, "First name must be at most 64 characters"),
    lastName: z
      .string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
        description: "Last name of the user",
      })
      .min(3, "Last name must be at least 3 characters")
      .max(50, "Last name must be at most 64 characters"),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
        description: "Email of the user",
      })
      .email("Invalid email"),
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

export default function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = form.handleSubmit(async (_values: FormValues) => {
    startTransition(async () => {
      try {
        // await signUp(values);
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", {
            message: error.message,
          });
        }
      }
    });
  });

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            rules={{
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>First name</FormLabel>
                <Input id={field.name} {...field} placeholder="John" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>Last name</FormLabel>
                <Input id={field.name} {...field} placeholder="Doe" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>Email</FormLabel>
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
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>Password</FormLabel>
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
                <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
                <PasswordInput id={field.name} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <RootFormError error={form.formState.errors?.root?.message} />

        <Button isLoading={pending} type="submit" className="w-full">
          Create an account
        </Button>
      </form>
    </Form>
  );
}
