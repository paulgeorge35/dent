import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { api } from "@/trpc/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (!session.user?.tenantId) redirect("/welcome");
  const accounts = await api.tenant.accounts();

  const currentTenant = await api.tenant.currentTenant();
  if (!currentTenant.profile.activeSubscription) redirect("/welcome");

  return (
    <AdminPanelLayout session={session} accounts={accounts}>
      {children}
    </AdminPanelLayout>
  );
}
