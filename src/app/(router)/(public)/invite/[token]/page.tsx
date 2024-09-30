import InvitePageContent from "@/components/auth/invite-content";
import { Shell } from "@/components/layout/shell";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  if (!token) {
    redirect("/dashboard");
  }
  const invitation = await api.tenant.invitation(token);
  if (!invitation) {
    redirect("/dashboard");
  }

  return (
    <Shell variant="center" className="center-v">
      <InvitePageContent invitation={invitation} />
    </Shell>
  );
}
