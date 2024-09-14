"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Icons } from "@/components/ui/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { StripePlan } from "@/types";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

const planFormSchema = z.object({
  planId: z.string({
    required_error: "Please select a subscription plan.",
  }),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

type PlanSwitchProps = {
  plans: StripePlan[];
  priceId?: string;
  hideLabels?: boolean;
  preview?: boolean;
  redirect?: string;
  update?: boolean;
};

export default function PlanSwitch({
  plans,
  priceId,
  hideLabels = false,
  preview = false,
  redirect = "/welcome",
  update = false,
}: PlanSwitchProps) {
  const t = useTranslations(update ? "page.subscription.update" : "page.subscription.resume");
  const tFields = useTranslations("fields.subscription");
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const { mutateAsync: updateSubscription, isPending } =
    api.stripe.updateSubscription.useMutation({
      onSuccess: () => {
        toast.success("Subscription updated successfully");
        router.push(redirect);
      },
    });
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      planId: priceId,
    },
  });

  const { data: previewData, isLoading } = api.stripe.previewUpdate.useQuery(
    {
      priceId: form.watch("planId"),
      prorationDate: now,
    },
    {
      enabled:
        !!form.watch("planId") && preview && form.watch("planId") !== priceId,
    },
  );

  const onSubmit = (values: PlanFormValues) => {
    startTransition(async () => {
      try {
        await updateSubscription({
          priceId: values.planId,
        });
      } catch (error) {
        if (error instanceof Error)
          form.setError("root", { message: error.message });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="planId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel
                className={cn({
                  "sr-only": hideLabels,
                })}
              >
                {tFields("title")}
              </FormLabel>
              <FormDescription
                className={cn({
                  "sr-only": hideLabels,
                })}
              >
                {tFields("description")}
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-4xl grid-cols-1 items-stretch gap-8 pt-2 md:grid-cols-2 lg:grid-cols-3"
                disabled={isPending || pending}
              >
                {plans.map((plan) => (
                  <FormItem key={plan.id} className="col-span-1">
                    <FormLabel className="group">
                      <FormControl>
                        <RadioGroupItem value={plan.id} className="sr-only" />
                      </FormControl>
                      <div className="relative flex cursor-pointer flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
                        {priceId &&
                          priceId === plan.product.default_price.id && (
                            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                              <span
                                className={
                                  "badge rounded-lg border-0 bg-primary px-2 py-[2px] text-xs font-semibold text-secondary"
                                }
                              >
                                {tFields("current-plan")}
                              </span>
                            </div>
                          )}
                        <div className="bg-base-100 z-10 flex h-full flex-col gap-5 rounded-lg border border-border bg-background p-8 shadow-sm group-has-[:checked]:border-primary">
                          <div className="flex items-center justify-between gap-4">
                            <div className="w-full">
                              <Image
                                height={60}
                                width={60}
                                alt={plan.product.name}
                                src={plan.product.images[0] ?? ""}
                                className="mx-auto h-[95px] w-auto"
                              />
                              <div className="my-4 w-full border-b border-border shadow-sm" />
                              <span className="flex">
                                <p className="text-lg font-bold lg:text-xl">
                                  {plan.product.name}
                                </p>
                              </span>
                              <p className="text-balanced mt-1 h-[4.5em] overflow-hidden text-xs font-light">
                                {plan.product.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <p
                              className={
                                "text-5xl font-extrabold tracking-tight"
                              }
                            >
                              {(plan.product.default_price.unit_amount ?? 0) /
                                100}
                            </p>
                            <div className="mb-[4px] flex items-end">
                              <p className="text-xs font-semibold uppercase">
                                RON
                              </p>
                              <p className="text-xs font-semibold text-muted-foreground">
                                /month
                              </p>
                            </div>
                          </div>
                          <ul className="flex-1 space-y-2.5 text-base leading-relaxed">
                            {plan.product.marketing_features.map((feature) => (
                              <li
                                key={feature.name}
                                className="flex items-center gap-2 text-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="h-[18px] w-[18px] shrink-0 opacity-80"
                                >
                                  <title>Check</title>
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>

                                <span>{feature.name}</span>
                              </li>
                            ))}
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
        {previewData?.isAllowed === false && (
          <span className="horizontal gap-2 rounded-lg bg-muted px-2 py-1">
            <Icons.info className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("tooltip.max-users")}
            </p>
          </span>
        )}
        {previewData?.proration && (
          <span className="horizontal items-start gap-2 rounded-lg bg-muted px-2 py-1">
            <Icons.info className="h-5 w-5 text-primary" />
            <p className="grow text-sm text-muted-foreground">
              {t("tooltip.proration", {
                amount: (
                  previewData.proration.reduce(
                    (acc, curr) => acc + curr.amount,
                    0,
                  ) / 100
                ).toFixed(2),
              })}
              <div>
                {isOpen && (
                  <ul className="mt-2">
                    {previewData.proration.map((proration) => (
                      <li
                        className="horizontal center-v justify-between text-xs"
                        key={proration.id}
                      >
                        <p>{proration.description}</p>
                        <p className="font-medium">
                          {(proration.amount / 100).toFixed(2)} RON
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </p>
            <button
              className="flex flex-shrink-0 items-center text-xs text-primary hover:underline focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              type="button"
            >
              <span className="ml-1">
                {isOpen ? "Hide details" : "Show details"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </span>
        )}
        <span className="flex justify-end">
          <Button
            variant="expandIcon"
            Icon={ArrowRight}
            iconPlacement="right"
            isLoading={isPending || pending || isLoading}
            disabled={!previewData?.isAllowed}
            type="submit"
          >
            {t("button")}
          </Button>
        </span>
      </form>
    </Form>
  );
}
