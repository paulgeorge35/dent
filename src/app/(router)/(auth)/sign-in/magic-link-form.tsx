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
import { signInMagicLink } from "./actions";
import RootFormError from "@/components/ui/root-form-error";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function MagicLinkSignIn() {
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
        await signInMagicLink(values.email);
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

        <RootFormError error={form.formState.errors?.root?.message} />

        <Button isLoading={pending} type="submit" className="col-span-2 w-full">
          Sign in with magic link
        </Button>
      </form>
    </Form>
  );
}
