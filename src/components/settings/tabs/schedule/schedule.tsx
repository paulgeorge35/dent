import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import type { WorkingHours } from "@/types/schema";
import WorkingHoursComponent from "./components/working-hours";

export default async function Schedule() {
  const me = await api.user.me();
  const t = await useTranslations("page.settings.tabs.schedule");
  return (
    <TabsContent
      value="schedule"
      className="!mt-0 flex flex-col gap-4 md:max-w-screen-md"
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("working-hours.title")}</CardTitle>
          <CardDescription>{t("working-hours.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <WorkingHoursComponent
            workingHours={me.workingHours as WorkingHours[]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("days-off.title")}</CardTitle>
          <CardDescription>{t("days-off.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">test</CardContent>
      </Card>
    </TabsContent>
  );
}
