import { PageHeader } from "@/app/_components/page-header";
import Account from "@/app/_components/settings/account";
import Customization from "@/app/_components/settings/customization";
import SettingsTabs from "@/app/_components/settings/settings-tabs";
import { constructMetadata } from "@/lib/utils";

import { Shell } from "@/components/shell";

export const metadata = constructMetadata({
  page: "Settings",
});

export default async function Settings() {
  return (
    <Shell variant="center">
      <PageHeader
        icon="⚙️"
        title="Account Settings"
        subtitle="Customize your account settings and preferences."
        className="mb-4 md:hidden"
      />
      <SettingsTabs>
        <Account />
        <Customization />
      </SettingsTabs>
    </Shell>
  );
}
