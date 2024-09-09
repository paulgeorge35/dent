import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/translations";
import CurrentMembership from "./components/current-plan";


export default async function Membership() {
  const t = await useTranslations("page.settings.tabs.plan");
  return (
    <TabsContent value="plan" className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("subscription.label")}</CardTitle>
          <CardDescription>{t("subscription.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <CurrentMembership />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
