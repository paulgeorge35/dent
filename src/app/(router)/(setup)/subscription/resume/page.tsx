import PlanSwitch from "@/components/auth/plan-switch";
import BackButton from "@/components/layout/back-button";
import { Shell } from "@/components/layout/shell";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import { z } from "zod";

const searchParamsSchema = z.object({
  redirectUrl: z.string().optional(),
});

interface ResumeSubscriptionProps {
  searchParams: Promise<SearchParams>;
}

export default async function ResumeSubscription(props: ResumeSubscriptionProps) {
  const searchParams = await props.searchParams;
  const t = await useTranslations("page.subscription.resume");
  const plans = await api.stripe.plans();
  const { redirectUrl } = searchParamsSchema.parse(searchParams);

  return (
    <Shell variant="center" className="center">
      <BackButton />
      <Card>
        <CardContent className="space-y-2 pt-4">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p>{t("description")}</p>
          <PlanSwitch hideLabels plans={plans} preview redirect={redirectUrl} />
        </CardContent>
      </Card>
    </Shell>
  );
}
