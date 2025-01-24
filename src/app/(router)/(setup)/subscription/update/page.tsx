import PlanSwitch from "@/components/auth/plan-switch";
import BackButton from "@/components/layout/back-button";
import { Shell } from "@/components/layout/shell";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import type { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { z } from "zod";

const searchParamsSchema = z.object({
  redirectUrl: z.string().optional(),
});

interface UpdateSubscription {
  searchParams: Promise<SearchParams>;
}
interface PlanI {
  plan: Plan;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan;
  };
}
export default async function UpdateSubscription(props: UpdateSubscription) {
  const searchParams = await props.searchParams;
  const t = await useTranslations("page.subscription.update");
  const { redirectUrl } = searchParamsSchema.parse(searchParams);
  const plans = await api.stripe.plans();
  const { plan, subscription } =
    (await api.stripe.subscription()) as unknown as PlanI;

  if (subscription.cancel_at_period_end) {
    return redirect(redirectUrl ?? "/dashboard");
  }

  return (
    <Shell variant="center" className="center">
      <BackButton />
      <Card>
        <CardContent className="space-y-2 pt-4">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p>{t("description")}</p>
          <PlanSwitch
            priceId={plan.stripePriceId}
            hideLabels
            plans={plans}
            preview
            redirect={redirectUrl}
            update
          />
        </CardContent>
      </Card>
    </Shell>
  );
}
