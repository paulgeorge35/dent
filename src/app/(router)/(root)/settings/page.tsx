import Account from "@/app/_components/settings/tabs/account/account";
import Customization from "@/app/_components/settings/tabs/customization/customization";
import Staff from "@/app/_components/settings/tabs/staff/staff";
import SettingsTabs from "@/app/_components/settings/settings-tabs";
import { constructMetadata } from "@/lib/utils";
import { type SearchParams } from "@/types";
import { z } from "zod";
import { Shell } from "@/components/shell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Plan from "@/app/_components/settings/tabs/plan/plan";

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
  const isAdmin = session!.user?.role === "ADMIN";
  const adminOnlyTabs = ["staff", "plan"];

  if (tab && adminOnlyTabs.includes(tab) && !isAdmin) redirect("/settings");
  return (
    <Shell variant="center">
      <SettingsTabs isAdmin={session!.user?.role === "ADMIN"}>
        <Account />
        {isAdmin && <Staff />}
        {isAdmin && <Plan />}
        <Customization />
      </SettingsTabs>
    </Shell>
  );
}
