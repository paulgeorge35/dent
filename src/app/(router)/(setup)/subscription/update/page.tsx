import { Shell } from "@/components/layout/shell";
import { api } from "@/trpc/server";
import { Card, CardContent } from "@/components/ui/card";
import type Stripe from "stripe";
import type { Plan } from "@prisma/client";
import PlanSwitch from "@/components/auth/plan-switch";

interface PlanI {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
}
export default async function ResumeSubscription() {
  const plans = await api.stripe.plans();
  const { plan } = (await api.stripe.subscription()) as unknown as PlanI;

  return (
    <Shell variant="center">
      <Card>
        <CardContent className="space-y-2 pt-4">
          <h1 className="text-4xl font-bold">Change Plan</h1>
          <p>In order to change your plan, select one of the plans below.</p>
          <PlanSwitch
            priceId={plan.stripePriceId}
            hideLabels
            plans={plans}
            preview
          />
        </CardContent>
      </Card>
    </Shell>
  );
}
