import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import ClinicForm from "./components/clinic-form";
import CurrentMembership from "./components/current-plan";

export default async function Clinic() {
  const t = await useTranslations("page.settings.tabs.clinic");
  const { profile } = await api.tenant.currentTenant();
  return (
    <TabsContent value="clinic" className="md:max-w-screen-md">
      <section className="flex flex-col gap-2 md:gap-4">
        <ClinicForm clinic={profile} />
        <CurrentMembership />
      </section>
    </TabsContent>
  );
}
