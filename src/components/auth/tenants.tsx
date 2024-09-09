import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { api } from "@/trpc/server";
import type { TenantAccount } from "@/types/schema";
import CreateTenant from "./create-tenant-button";
import TenantCard from "./tenant-card";

export default async function Tenants() {
  const session = await auth();
  const accounts = await api.tenant.accounts();
  const t = await useTranslations("page.welcome.clinic");

  if (accounts.length === 0) {
    return (
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row gap-1 border-b">
          <h2 className="text-sm text-muted-foreground">
            {t("clinics-for")}{" "}
            <span className="font-bold text-secondary-foreground">
              {session!.email}
            </span>
          </h2>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <h3 className="text-center text-lg font-semibold">
              {t("no-clinics")}
            </h3>
            <CreateTenant />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row gap-1 border-b">
          <h2 className="text-sm text-muted-foreground">
            {t("clinics-for")}{" "}
            <span className="font-bold text-secondary-foreground">
              {session!.email}
            </span>
          </h2>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {accounts.map((account) => (
            <TenantCard key={account.id} account={account as TenantAccount} />
          ))}
        </CardContent>
      </Card>
      {accounts.length > 0 && (
        <Card className="border-0 bg-muted shadow-none">
          <CardContent className="flex items-center justify-between py-4">
            <h1 className="text-sm">{t("want-to-create")}</h1>
            <CreateTenant />
          </CardContent>
        </Card>
      )}
    </>
  );
}
