"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { UserComplete } from "@/server/api/routers/user";

import { PhoneInput, getPhoneData } from "@/components/phone-input";

import AvatarInput from "@/components/dropzone-input/avatar-v2";
import { getErrorMessage } from "@/lib/handle-error";
import type { Speciality } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialityId: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  avatarId: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  me: UserComplete;
  specialities: Speciality[];
}

export default function ProfileForm({ me, specialities }: ProfileFormProps) {
  const t = useTranslations("page.settings.tabs.account.profile");
  const te = useTranslations("errors");
  const router = useRouter();
  const { mutate, isPending } = api.user.update.useMutation({
    onSuccess: (data) => {
      toast.success(t("status.success"));
      router.refresh();
      form.reset({
        firstName: data.profile?.firstName ?? undefined,
        lastName: data.profile?.lastName ?? undefined,
        specialityId: data.specialityId ?? undefined,
        title: data.profile?.title ?? undefined,
        email: data.profile?.email ?? undefined,
        phone: data.profile?.phone ?? undefined,
        avatarId: data.profile?.avatar?.id,
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
      firstName: me.profile?.firstName ?? undefined,
      lastName: me.profile?.lastName ?? undefined,
      specialityId: me.specialityId ?? undefined,
      title: me.profile?.title ?? undefined,
      email: me.profile?.email ?? undefined,
      phone: me.profile?.phone ?? undefined,
      avatarId: me.profile?.avatar?.id ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const phoneData = values?.phone
      ? getPhoneData(values?.phone)
      : { isValid: true };

    if (!phoneData.isValid) {
      form.setError("phone", {
        type: "manual",
        message: te("phone.error"),
      });
      return;
    }

    mutate(values);
  });

  return (
    <Card>
      <CardContent className="vertical gap-4 pt-4">
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-2 items-start gap-6"
          >
            <FormField
              control={form.control}
              name="avatarId"
              render={({ field }) => (
                <FormItem className="vertical center-h col-span-2">
                  <AvatarInput
                    id={field.name}
                    maxSize={10}
                    {...field}
                    value={form.watch(field.name)}
                    onChange={(value) => field.onChange(value)}
                    fallback={`${me.profile?.firstName} ${me.profile?.lastName}`}
                    type="avatar"
                  />
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
                  <FormLabel htmlFor={field.name}>
                    {t("firstName.label")}
                  </FormLabel>
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
                  <FormLabel htmlFor={field.name}>
                    {t("lastName.label")}
                  </FormLabel>
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
                  <FormLabel htmlFor={field.name}>{t("title.label")}</FormLabel>
                  <Input id={field.name} {...field} placeholder="e.g. Dr." />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialityId"
              render={({ field }) => (
                <FormItem className="col-span-1 w-full">
                  <FormLabel htmlFor={field.name}>
                    {t("speciality.label")}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={form.watch(field.name)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialities.map((speciality) => (
                        <SelectItem key={speciality.id} value={speciality.id}>
                          {speciality.name}
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
                  <FormLabel htmlFor={field.name}>{t("email.label")}</FormLabel>
                  <Input id={field.name} {...field} disabled type="email" />
                  <FormDescription>
                    {t("email.description")}
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
                  <FormLabel htmlFor={field.name}>{t("phone.label")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      id={field.name}
                      autoComplete="tel"
                      {...field}
                      required={false}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>{t("phone.description")}</FormDescription>
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
              {t("button")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
