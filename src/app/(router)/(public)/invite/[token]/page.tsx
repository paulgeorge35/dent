import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import InvitePageContent from "@/components/InvitePageContent";
import { Shell } from "@/components/shell";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  if (!token) {
    redirect("/");
  }
  const invitation = await api.tenant.invitation(token);
  if (!invitation) {
    redirect("/");
  }

  return (
    <Shell variant="center" className="center-v">
      <InvitePageContent invitation={invitation} />
    </Shell>
  );
}
