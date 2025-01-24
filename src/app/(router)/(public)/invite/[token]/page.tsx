import InvitePageContent from "@/components/auth/invite-content";
import { Shell } from "@/components/layout/shell";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function InvitePage(
  props: {
    params: Promise<{ token: string }>;
  }
) {
  const params = await props.params;
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
