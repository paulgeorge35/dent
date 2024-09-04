"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { StripePlan } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { api } from "@/trpc/react";
import { AvatarUpload } from "@/components/dropzone-input/avatar";
import { useTranslations } from "next-intl";

const schema = z.object({
  name: z.string().min(1, "name.required").max(50, "name.max-length"),
  size: z.string().optional(),
  avatarId: z.string().nullable(),
  planId: z.string({
    required_error: "plan.required",
  }),
});

type FormValues = z.infer<typeof schema>;

export default function ClinicForm() {
  const t = useTranslations("page.create-clinic");
  const router = useRouter();
  const { data: profile } = api.user.profile.useQuery();

  const [products, setProducts] = useState<StripePlan[]>([]);
  const [pending, startTransition] = useTransition();

  const { data } = api.stripe.plans.useQuery();

  const { mutateAsync, isPending } = api.stripe.checkout.useMutation({
    onSuccess: (data) => {
      toast.success(t("status.success.title"), {
        description: t("status.success.description"),
      });
      if (data.redirectUrl) router.push(data.redirectUrl);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      avatarId: null,
    },
  });

  useEffect(() => {
    setProducts(data ?? []);
  }, [data]);

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    startTransition(async () => {
      try {
        await mutateAsync(values);
      } catch (error) {
        if (error instanceof Error)
          form.setError("root", { message: error.message });
      }
    });
  });

  const sizes = [
    { value: "1", label: t("sizes.only-me") },
    { value: "2-5", label: "2-5" },
    { value: "6-10", label: "6-10" },
    { value: "11-20", label: "11-20" },
    { value: "21-50", label: "21-50" },
    { value: "50+", label: "50+" },
    { value: "N/A", label: t("sizes.not-applicable") },
  ];

  return (
    <Form {...form}>
      <form className="grid w-full grid-cols-2 gap-4" onSubmit={onSubmit}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>
                {t("fields.name.title")}
              </FormLabel>
              <Input id={field.name} {...field} placeholder="Ex: Acme Clinic" />
              <FormDescription>{t("fields.name.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="size"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>
                {t("fields.size.title")}{" "}
                <span className="text-muted-foreground">({t("optional")})</span>
              </FormLabel>
              <Select onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("fields.size.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size, index) => (
                    <SelectItem key={index} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("fields.size.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarId"
          render={({ field }) => (
            <FormItem className="vertical col-span-2 items-start">
              <FormLabel htmlFor={field.name}>
                {t("fields.logo.title")}{" "}
                <span className="text-muted-foreground">({t("optional")})</span>
              </FormLabel>
              <AvatarUpload
                id={field.name}
                maxSize={10}
                {...field}
                value={form.watch(field.name)}
                onChange={(value) => field.onChange(value)}
                className="horizontal col-span-4 items-center justify-center gap-4 p-4"
                fallback={form.watch("name")}
                type="clinic-logo"
                fixedColor
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="planId"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-1">
              <FormLabel>{t("fields.plan.title")}</FormLabel>
              <FormDescription>{t("fields.plan.description")}</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-4xl grid-cols-1 items-stretch gap-8 pt-2 lg:grid-cols-3"
                disabled={isPending || pending}
              >
                {products.length === 0 &&
                  Array.from({ length: 3 }).map((_el, index) => (
                    <Skeleton
                      key={index}
                      className="col-span-1 h-[450px] w-full min-w-[calc(52rem/3)]"
                    />
                  ))}
                {products.map((plan) => (
                  <FormItem key={plan.id} className="col-span-1 w-full">
                    <FormLabel className="group">
                      <FormControl>
                        <RadioGroupItem value={plan.id} className="sr-only" />
                      </FormControl>
                      <div className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
                        <div className="bg-base-100 z-10 flex h-full w-full flex-col gap-5 rounded-lg border border-border bg-background p-8 shadow-sm group-has-[:checked]:border-primary">
                          <div className="flex items-center justify-between gap-4">
                            <div className="w-full">
                              <Image
                                height={60}
                                width={60}
                                alt={plan.product.name}
                                src={plan.product.images[0]!}
                                className="mx-auto h-[95px] w-auto"
                              />
                              <div className="my-4 w-full border-b border-border shadow-sm" />
                              <span className="flex">
                                <p className="text-lg font-bold text-primary lg:text-xl">
                                  {plan.product.name}
                                </p>
                              </span>
                              <p className="text-balanced mt-1 h-[4.5em] overflow-hidden text-xs font-light text-primary">
                                {plan.product.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <p
                              className={`text-5xl font-extrabold tracking-tight text-primary`}
                            >
                              {plan.product.default_price.unit_amount! / 100}
                            </p>
                            <div className="mb-[4px] flex items-end">
                              <p className="text-xs font-semibold uppercase text-primary">
                                RON
                              </p>
                              <p className="text-xs font-semibold text-muted-foreground">
                                /month
                              </p>
                            </div>
                          </div>
                          <ul className="flex-1 space-y-2.5 text-base leading-relaxed text-primary">
                            {plan.product.marketing_features.map(
                              (feature, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-[18px] w-[18px] shrink-0 opacity-80"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                      clipRule="evenodd"
                                    />
                                  </svg>

                                  <span>{feature.name}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        {profile?.stripeFreeTrialUsed === false && (
          <p className="horizontal col-span-2 items-start justify-center rounded-lg bg-muted p-2 text-xs text-muted-foreground">
            <Info className="mr-2 size-4" />
            <p>
              {t("get-started-with")}
              <span className="ml-[0.5em] font-bold">
                {t("14-days-free-trial")}
              </span>
              .{t("cancel-anytime")}
            </p>
          </p>
        )}
        <Button
          variant="expandIcon"
          Icon={ArrowRight}
          iconPlacement="right"
          className="col-span-2"
          isLoading={pending}
        >
          {t("go-to-payment")}
        </Button>
        <p className="col-span-2 text-balance text-center text-xs text-muted-foreground">
          {t("by-continuing")}{" "}
          <Link
            className="font-medium hover:underline"
            href="https://mydent.one/en/tos"
          >
            {t("tos")}
          </Link>{" "}
          {t("and")}{" "}
          <Link
            className="font-medium hover:underline"
            href="https://mydent.one/en/privacy-policy"
          >
            {t("privacy-policy")}
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}
