import { api } from "@/trpc/server";

import { TabsContent } from "@/components/ui/tabs";

import { useTranslations } from "@/lib/translations";
import LogoutDialog from "../../../auth/logout-dialog";
import PasswordForm from "./components/password-form";
import ProfileForm from "./components/profile-form";

export default async function Account() {
  const me = await api.user.me();
  const specialities = await api.speciality.list({});
  const t = await useTranslations("page.settings.tabs.account");
  return (
    <TabsContent
      value="account"
      className="flex flex-col gap-4 md:max-w-screen-md"
    >
      <ProfileForm me={me} specialities={specialities.content} />
      <h1 className="text-lg font-bold">{t("password.title")}</h1>
      <PasswordForm />
      <span>
        <LogoutDialog />
      </span>
    </TabsContent>
  );
}
