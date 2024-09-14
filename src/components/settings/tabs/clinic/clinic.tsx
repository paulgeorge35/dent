import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import ClinicForm from "./components/clinic-form";
import CurrentMembership from "./components/current-plan";

export default async function Clinic() {
  const t = await useTranslations("page.settings.tabs.clinic");
  const { profile } = await api.tenant.currentTenant();
  return (
    <TabsContent value="clinic" className="flex flex-col gap-4 md:max-w-screen-md">
      <ClinicForm clinic={profile} />
      <CurrentMembership />
    </TabsContent>
  );
}
