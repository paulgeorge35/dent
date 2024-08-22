"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { type UserComplete } from "@/server/api/routers/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { PhoneInput, getPhoneData } from "@/components/phone-input";

import DropzoneInput from "@/components/dropzone-input";
import { Save } from "lucide-react";
import { avatarSchema } from "@/types/schema";
import type { Specialization } from "@prisma/client";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specializationId: z.string().nullish(),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  avatar: avatarSchema,
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  me: UserComplete;
  specializations: Specialization[];
}

export default function ProfileForm({ me, specializations }: ProfileFormProps) {
  const router = useRouter();
  const { mutate, isPending } = api.user.update.useMutation({
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      router.refresh();
      form.reset({
        firstName: data.profile?.firstName ?? undefined,
        lastName: data.profile?.lastName ?? undefined,
        specializationId: data.specializationId ?? undefined,
        title: data.profile?.title ?? undefined,
        avatar: data.profile?.avatar ?? undefined,
        email: data.profile?.email ?? undefined,
        phone: data.profile?.phone ?? undefined,
      });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: me.profile?.firstName ?? undefined,
      lastName: me.profile?.lastName ?? undefined,
      specializationId: me.specializationId ?? undefined,
      title: me.profile?.title ?? undefined,
      avatar: me.profile?.avatar ?? undefined,
      email: me.profile?.email ?? undefined,
      phone: me.profile?.phone ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const phoneData = values?.phone
      ? getPhoneData(values?.phone)
      : { isValid: true };

    if (!phoneData.isValid) {
      form.setError("phone", {
        type: "manual",
        message: "Invalid phone number",
      });
      return;
    }

    mutate(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid grid-cols-2 items-start gap-6">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="vertical center-h col-span-2">
              <DropzoneInput
                {...field}
                id={field.name}
                onChange={(value) => field.onChange(value)}
              />
              <FormDescription>
                Upload a new avatar. The image will be cropped to a square.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          rules={{
            required: "First name is required",
            minLength: { value: 1, message: "First name is required" },
          }}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>First name</FormLabel>
              <Input id={field.name} {...field} placeholder="First name" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          rules={{
            required: "Last name is required",
            minLength: { value: 1, message: "Last name is required" },
          }}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>Last name</FormLabel>
              <Input id={field.name} {...field} placeholder="Last name" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>Title</FormLabel>
              <Input id={field.name} {...field} placeholder="e.g. Dr." />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specializationId"
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>Specialization</FormLabel>
              <Select onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((specialization) => (
                    <SelectItem
                      key={specialization.id}
                      value={specialization.id}
                    >
                      {specialization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            minLength: { value: 1, message: "Name is required" },
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>E-Mail</FormLabel>
              <Input
                id={field.name}
                {...field}
                placeholder="E-Mail"
                disabled
                type="email"
                autoComplete="email"
              />
              <FormDescription>
                This is the email address that will be used to log in. If you
                wish to change it, please contact support.
                <FormMessage />
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel htmlFor={field.name}>Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  id={field.name}
                  autoComplete="tel"
                  {...field}
                  required={false}
                />
              </FormControl>
              <FormDescription>
                Enter a valid phone number with country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="hidden sm:col-span-1 sm:block" />
        <Button
          isLoading={isPending}
          disabled={!form.formState.isDirty}
          Icon={Save}
          variant="expandIcon"
          iconPlacement="left"
          type="submit"
          className="col-span-2 sm:w-fit"
        >
          Update profile
        </Button>
      </form>
    </Form>
  );
}
