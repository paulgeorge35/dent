import PlanSwitch from "@/components/auth/plan-switch";
import { Shell } from "@/components/layout/shell";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";

export default async function ResumeSubscription() {
  const plans = await api.stripe.plans();

  return (
    <Shell variant="center">
      <Card>
        <CardContent className="space-y-2 pt-4">
          <h1 className="text-4xl font-bold">Resume Subscription</h1>
          <p>
            In order to resume your clinic&apos;s activity, reactivate one of
            the subscriptions plans below.
          </p>
          <PlanSwitch hideLabels plans={plans} preview />{" "}
        </CardContent>
      </Card>
    </Shell>
  );
}
