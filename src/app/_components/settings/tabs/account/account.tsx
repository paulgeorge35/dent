import { api } from "@/trpc/server";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import LogoutDialog from "../../../auth/logout-dialog";
import PasswordForm from "./components/password-form";
import ProfileForm from "./components/profile-form";

export default async function Account() {
  const me = await api.user.me();

  return (
    <TabsContent
      value="account"
      className="flex flex-col gap-4 md:max-w-screen-md !mt-0"
    >
      <Card>
        <CardContent className="pt-4">
          <ProfileForm me={me} />
        </CardContent>
      </Card>
      <h1 className="text-lg font-bold">Change Password</h1>
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
