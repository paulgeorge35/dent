import { auth } from "@/auth";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { api } from "@/trpc/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
    return null;
  }

  if (!session.user?.tenantId) {
    redirect("/welcome");
    return null;
  }

  const accounts = await api.tenant.accounts();

  const currentTenant = await api.tenant.currentTenant();
  if (!currentTenant.profile.activeSubscription) redirect("/welcome");

  const locale = (await getLocale()) as "en" | "ro";

  return (
    <AdminPanelLayout session={session} accounts={accounts} locale={locale}>
      {children}
    </AdminPanelLayout>
  );
}
