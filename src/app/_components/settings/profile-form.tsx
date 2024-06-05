"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { type UserComplete } from "@/server/api/routers/user";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { PhoneInput, getPhoneData } from "@/components/phone-input";

import DropzoneInput from "@/components/dropzone-input";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  county: z.string().min(1, "County is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  avatar: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  me: UserComplete;
}

export default function ProfileForm({ me }: ProfileFormProps) {
  const router = useRouter();
  const { data: counties, isFetching: isFetchingCounties } =
    api.utils.getCounties.useQuery();
  const { mutate, isPending } = api.user.update.useMutation({
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      router.refresh();
      form.reset({
        firstName: data.profile?.firstName ?? undefined,
        lastName: data.profile?.lastName ?? undefined,
        avatar: data.profile?.avatar ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
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
      avatar: me.profile?.avatar ?? undefined,
      email: me.email ?? undefined,
      phone: me.phone ?? undefined,
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
            <FormItem className="col-span-2">
              <FormLabel htmlFor={field.name}>Avatar</FormLabel>
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
          name="county"
          rules={{
            required: "County is required",
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>County</FormLabel>
              <Select onValueChange={field.onChange} required {...field}>
                <SelectTrigger id="county" disabled={isFetchingCounties}>
                  <SelectValue id="county" placeholder="Select a county" />
                </SelectTrigger>
                <SelectContent>
                  {counties?.map((county) => (
                    <SelectItem key={county.id} value={county.name}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
        <FormField
          control={form.control}
          name="bio"
          rules={{
            maxLength: {
              value: 200,
              message: "Bio must be less than 200 characters",
            },
          }}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Bio</FormLabel>
              <Textarea
                id={field.name}
                {...field}
                placeholder=""
                className="max-h-40"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={isPending}
          disabled={!form.formState.isDirty}
          type="submit"
        >
          Update profile
        </Button>
      </form>
    </Form>
  );
}
