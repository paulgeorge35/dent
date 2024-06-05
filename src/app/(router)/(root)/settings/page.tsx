import { PageHeader } from "@/app/_components/page-header";
import Account from "@/app/_components/settings/account";
import Companies from "@/app/_components/settings/companies";
import Customization from "@/app/_components/settings/customization";
import Membership from "@/app/_components/settings/membership";
import SettingsTabs from "@/app/_components/settings/settings-tabs";
import { type SearchParams } from "@/types";
import { constructMetadata } from "@/lib/utils";
import { z } from "zod";

import { Shell } from "@/components/shell";

const searchParamsSchema = z
  .object({
    tab: z.string().optional(),
  })
  .optional();

export const metadata = constructMetadata({
  page: "Settings",
});

export interface SettingsPageProps {
  searchParams?: SearchParams;
}

const getActiveTab = (tab?: string) => {
  if (tab === "companies") {
    return <Companies />;
  }
  if (tab === "membership") {
    return <Membership />;
  }
  if (tab === "customization") {
    return <Customization />;
  }
  return <Account />;
};

export default async function Settings({ searchParams }: SettingsPageProps) {
  const params = searchParamsSchema.safeParse(searchParams);

  return (
    <Shell className="flex flex-col items-start">
      <PageHeader
        icon="⚙️"
        title="Account Settings"
        subtitle="Customize your account settings and preferences."
      />
      <PageHeader
        title="Account Settings"
        className="fixed z-[49] mt-[-16px] bg-background py-4 opacity-0 md:hidden"
      />
      <SettingsTabs>{getActiveTab(params.data?.tab)}</SettingsTabs>
    </Shell>
  );
}
