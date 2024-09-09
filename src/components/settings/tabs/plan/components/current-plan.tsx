import { api } from "@/trpc/server";
import type { Plan } from "@prisma/client";
import { DateTime } from "luxon";
import Link from "next/link";
import type Stripe from "stripe";
import CancelMembership from "./cancel-plan-dialog";

interface PlanI {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
}

export default async function CurrentMembership() {
  const { plan, subscription } =
    (await api.stripe.subscription()) as unknown as PlanI;

  if (subscription.cancel_at_period_end) {
    return <Canceled plan={plan} subscription={subscription} />;
  }

  if (subscription.status === "trialing") {
    return <Trial plan={plan} subscription={subscription} />;
  }

  return (
    <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
      <span>
        <span className="horizontal center-v gap-2">
          <h1 className="text-lg">{`MyDent - ${plan.name} Plan`}</h1>
          <span className="rounded-full border border-blue-500 px-2 py-[2px] text-xs font-light">
            Active
          </span>
        </span>
        <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} per month`}</h1>
        <p className="text-sm text-muted-foreground">
          Your membership will renew on{" "}
          <b>
            {DateTime.fromMillis(
              subscription.current_period_end * 1000,
            ).toLocaleString(DateTime.DATE_FULL)}
          </b>
        </p>
        <Link
          href="/subscription/update"
          className="text-xs text-link hover:text-link-hover hover:underline"
        >
          Change plan
        </Link>
      </span>
      <CancelMembership />
    </section>
  );
}

type PlanProps = {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
};

const Trial = ({ plan, subscription }: PlanProps) => (
  <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
    <span>
      <span className="horizontal center-v gap-2">
        <h1 className="text-lg">{`MyDent - ${plan.name} Plan`}</h1>
        <span className="rounded-full border border-primary px-2 py-[2px] text-xs font-light">
          Trial
        </span>
      </span>
      <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} per month`}</h1>
      <p className="text-sm text-muted-foreground">
        Your trial will end on{" "}
        <b>
          {DateTime.fromMillis(
            subscription.current_period_end * 1000,
          ).toLocaleString(DateTime.DATE_FULL)}
        </b>
        . To avoid being charged, cancel before the trial ends.
      </p>
    </span>
    <CancelMembership />
  </section>
);

const Canceled = ({ plan, subscription }: PlanProps) => (
  <section className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-2 md:flex-row md:items-center md:justify-between">
    <span>
      <span className="horizontal center-v gap-2">
        <h1 className="text-lg">{`MyDent - ${plan.name} Plan`}</h1>
        <span className="rounded-full border border-destructive px-2 py-[2px] text-xs font-light">
          Canceled
        </span>
      </span>
      <h1 className="text-xl font-semibold">{`${(subscription.plan.amount! / 100).toFixed(2)} ${subscription.plan.currency.toUpperCase()} per month`}</h1>
      <p className="text-sm text-muted-foreground">
        You canceled your membership but you will still be able to use MyDent
        until{" "}
        <b>
          {DateTime.fromMillis(
            subscription.current_period_end * 1000,
          ).toLocaleString(DateTime.DATE_FULL)}
        </b>
        .
      </p>
    </span>
  </section>
);
