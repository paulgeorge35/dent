import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import type { Plan } from "@prisma/client";
import { DateTime } from "luxon";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import type Stripe from "stripe";
import CancelMembership from "./cancel-plan-dialog";
import ResumeMembership from "./resume-plan-dialog";

interface PlanI {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
}

export default async function CurrentMembership() {
  const t = await useTranslations("page.settings.tabs.clinic");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("subscription.label")}</CardTitle>
        <CardDescription>{t("subscription.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-4">
        <MembershipCard />
      </CardContent>
    </Card>
  );
}

async function MembershipCard() {
  const t = await useTranslations("page.settings.tabs.clinic");
  const locale = await getLocale();
  const { plan, subscription } =
    (await api.stripe.subscription()) as unknown as PlanI;

  if (subscription.cancel_at_period_end) {
    return <Canceled plan={plan} subscription={subscription} />;
  }

  if (subscription.status === "trialing") {
    return <Trial plan={plan} subscription={subscription} />;
  }

  return (
    <>
      <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
        <span>
          <span className="horizontal center-v gap-2">
            <h1 className="text-lg">{`${plan.name} Plan`}</h1>
            <span className="rounded-full border border-blue-500 px-2 py-[2px] text-xs font-light">
              {t("subscription.status.active")}
            </span>
          </span>
          <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} ${t("subscription.per-month")}`}</h1>

          <Link
            href={`/subscription/update?redirectUrl=${encodeURIComponent(
              "/settings?tab=clinic",
            )}`}
            className="text-xs text-link hover:text-link-hover hover:underline"
          >
            {t("subscription.actions.change")}
          </Link>
        </span>
        <CancelMembership />
      </section>
      <p className="text-xs text-muted-foreground px-2">
        {t("subscription.subscription-renews")}{" "}
        <b>
          {DateTime.fromMillis(
            subscription.current_period_end * 1000,
          ).toLocaleString(DateTime.DATE_FULL, { locale })}
        </b>
      </p>
    </>
  );
}

type PlanProps = {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
};

const Trial = async ({ plan, subscription }: PlanProps) => {
  const t = await useTranslations("page.settings.tabs.clinic");
  const locale = await getLocale();
  return (
    <>
      <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
        <span>
          <span className="horizontal center-v gap-2">
            <h1 className="text-lg">{`${plan.name} Plan`}</h1>
            <span className="rounded-full border border-primary px-2 py-[2px] text-xs font-light">
              {t("subscription.status.trialing")}
            </span>
          </span>
          <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} ${t("subscription.per-month")}`}</h1>
          <Link
            href={`/subscription/update?redirectUrl=${encodeURIComponent(
              "/settings?tab=clinic",
            )}`}
            className="text-xs text-link hover:text-link-hover hover:underline"
          >
            {t("subscription.actions.change")}
          </Link>
        </span>
        <CancelMembership />
      </section>
      <p className="text-xs text-muted-foreground px-2">
        {t("subscription.trial-will-end")}{" "}
        <b>
          {DateTime.fromMillis(
            subscription.current_period_end * 1000,
          ).toLocaleString(DateTime.DATE_FULL, { locale })}
        </b>
        . {t("subscription.cancel-before")}
      </p>
    </>
  );
};

const Canceled = async ({ plan, subscription }: PlanProps) => {
  const t = await useTranslations("page.settings.tabs.clinic");
  const locale = await getLocale();
  return (
    <>
      <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
        <span>
          <span className="horizontal center-v gap-2">
            <h1 className="text-lg">{`${plan.name} Plan`}</h1>
            <span className="rounded-full border border-destructive px-2 py-[2px] text-xs font-light">
              {t("subscription.status.canceled")}
            </span>
          </span>
          <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} ${t("subscription.per-month")}`}</h1>
        </span>
        <ResumeMembership />
      </section>
      <p className="text-xs text-muted-foreground px-2">
        {t("subscription.active-until")}{" "}
        <b>
          {DateTime.fromMillis(
            subscription.current_period_end * 1000,
          ).toLocaleString(DateTime.DATE_FULL, { locale })}
        </b>
        .
      </p>
    </>
  );
};
