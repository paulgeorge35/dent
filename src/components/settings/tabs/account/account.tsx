import { api } from "@/trpc/server";

import { TabsContent } from "@/components/ui/tabs";

import LogoutDialog from "../../../auth/logout-dialog";
import PasswordForm from "./components/password-form";
import ProfileForm from "./components/profile-form";
import WebhookApiKeyForm from "./components/webhook-api-key";

export default async function Account() {
  const me = await api.user.me();
  const specialities = await api.speciality.list({});

  return (
    <TabsContent value="account" className="md:max-w-screen-md">
      <section className="flex flex-col gap-2 md:gap-4">
        <ProfileForm me={me} specialities={specialities.content} />
        <PasswordForm />
        <WebhookApiKeyForm webhookApiKey={me.webhookApiKey} />
        <span>
          <LogoutDialog />
        </span>
      </section>
    </TabsContent>
  );
}
