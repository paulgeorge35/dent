"use client";

import { CountySelect } from "@/components/address-input/county-input";
import AvatarInput from "@/components/dropzone-input/avatar-v2";
import { PhoneInput, getPhoneData } from "@/components/phone-input";
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
import { getErrorMessage } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Avatar, TenantProfile } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  county: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  avatarId: z.string().nullish().transform((value) => value ?? null),
});

type FormValues = z.infer<typeof schema>;

type ClinicFormProps = {
  clinic: TenantProfile & { avatar: Avatar | null };
};

export default function ClinicForm({ clinic }: ClinicFormProps) {
  const t = useTranslations("page.settings.tabs.clinic.details");
  const router = useRouter();
  const { mutate, isPending } = api.tenant.updateClinic.useMutation({
    onSuccess: (data) => {
      toast.success(t("status.success"));
      router.refresh();
      form.reset({
        name: data.profile?.name ?? undefined,
        county: data.profile?.county ?? undefined,
        address: data.profile?.address ?? undefined,
        zip: data.profile?.zip ?? undefined,
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
      name: clinic.name,
      county: clinic.county ?? undefined,
      address: clinic.address ?? undefined,
      zip: clinic.zip ?? undefined,
      phone: clinic.phone ?? undefined,
      avatarId: clinic.avatar?.id,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const phoneData = values?.phone
      ? getPhoneData(values?.phone)
      : { isValid: true };

    if (!phoneData.isValid) {
      form.setError("phone", {
        type: "manual",
        message: "phone.error",
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
                    fallback={clinic.name}
                    type="clinic-logo"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel htmlFor={field.name}>{t("name.label")}</FormLabel>
                  <Input id={field.name} {...field} />
                  <FormDescription>
                    {t("name.description")}
                    <FormMessage />
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor={field.name}>
                    {t("address.label")}
                  </FormLabel>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder="e.g. 123 Main St, Suite 200, Springfield"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="county"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1 w-full">
                  <FormLabel htmlFor={field.name}>
                    {t("county.label")}
                  </FormLabel>
                  <FormControl>
                    <CountySelect
                      name={field.value ?? ""}
                      onSelect={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>{t("zip.label")}</FormLabel>
                  <Input id={field.name} {...field} />
                  <FormMessage />
                </FormItem>
              )}
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
              {t("button")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
