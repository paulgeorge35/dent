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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "./actions";
import RootFormError from "@/components/ui/root-form-error";
import Link from "next/link";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function EmailSignIn() {
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
              <FormLabel htmlFor={field.name}>Email</FormLabel>
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
              {/* <FormLabel htmlFor={field.name}>Password</FormLabel> */}
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id={field.name} type="password" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <RootFormError error={form.formState.errors?.root?.message} />

        <Button isLoading={pending} type="submit" className="col-span-2 w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
