import { api } from "@/trpc/server";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import { useTranslations } from "@/lib/translations";
import LogoutDialog from "../../../auth/logout-dialog";
import PasswordForm from "./components/password-form";
import ProfileForm from "./components/profile-form";

export default async function Account() {
  const me = await api.user.me();
  const specializations = await api.specialization.list();
  const t = await useTranslations("page.settings.tabs.account");
  return (
    <TabsContent
      value="account"
      className="!mt-0 flex flex-col gap-4 md:max-w-screen-md"
    >
      <Card>
        <CardContent className="pt-4">
          <ProfileForm me={me} specializations={specializations} />
        </CardContent>
      </Card>
      <h1 className="text-lg font-bold">{t("password.title")}</h1>
      <Card>
        <CardContent className="p-6">
          <PasswordForm />
        </CardContent>
      </Card>
      <span>
        <LogoutDialog />
      </span>
    </TabsContent>
  );
}
