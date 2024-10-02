import { auth } from "@/auth";
import { Shell } from "@/components/layout/shell";
import SettingsTabs from "@/components/settings/settings-tabs";
import Account from "@/components/settings/tabs/account/account";
import Clinic from "@/components/settings/tabs/clinic/clinic";
import Customization from "@/components/settings/tabs/customization/customization";
import Schedule from "@/components/settings/tabs/schedule/schedule";
import Staff from "@/components/settings/tabs/staff/staff";
import Support from "@/components/settings/tabs/support/support";
import { constructMetadata } from "@/lib/utils";
import type { SearchParams } from "@/types";
import { redirect } from "next/navigation";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Settings",
});

const searchParamsSchema = z.object({
  tab: z.string().optional().default("account"),
});
export interface StaffPageProps {
  searchParams: SearchParams;
}

export default async function Settings({ searchParams }: StaffPageProps) {
  const session = await auth();
  const { tab } = searchParamsSchema.parse(searchParams);
  const isAdmin = session?.user?.role === "ADMIN";
  const adminOnlyTabs = ["staff", "plan"];

  if (tab && adminOnlyTabs.includes(tab) && !isAdmin) redirect("/settings");
  return (
    <Shell>
    <SettingsTabs isAdmin={isAdmin} tab={tab}>
        <Account />
        {isAdmin && <Clinic />}
        {isAdmin && <Staff />}
        <Customization />
        <Schedule />
        <Support />
      </SettingsTabs>
    </Shell>
  );
}
