import Invitations from "@/components/auth/invitations";
import LogoutDialog from "@/components/auth/logout-dialog";
import Tenants from "@/components/auth/tenants";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/translations";
import { constructMetadata } from "@/lib/utils";
import { Box } from "lucide-react";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function Welcome() {
  const t = await useTranslations("page.welcome");
  return (
    <div className="grid max-w-xl gap-4 text-center w-full">
      <div>
        <div className="relative z-20 flex items-center justify-center p-4 font-mono text-2xl font-medium text-primary">
          <Box className="mr-2 size-10" />
          MyDent
        </div>
        <h1 className="text-3xl font-bold text-balance">{t("title")}</h1>
        <p className="text-balance text-muted-foreground my-2">{t("subtitle")}</p>
      </div>
      <Tenants />
      <Invitations />
      <LogoutDialog>
        <Button
          variant="destructive"
          className="w-full border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-white mb-8"
        >
          {t("sign-out")}
        </Button>
      </LogoutDialog>
    </div>
  );
}
