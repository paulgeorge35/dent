import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { type InvitationAccount } from "@/types/schema";
import InvitationCard from "./invitation-card";

export default async function Invitations() {
  const session = (await auth())!;
  const invitations = await api.user.invitations();

  if (invitations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-semibold">
          No pending invitations
        </h1>
        <p className="text-center text-muted-foreground">
          You have no pending invitations at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-[-16px] text-left font-semibold">
        Pending invitations
      </h1>
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row gap-1 border-b">
          <h2 className="text-sm text-muted-foreground">
            Invitations for{" "}
            <span className="font-bold text-secondary-foreground">
              {session.email}
            </span>
          </h2>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation.token}
              invitation={invitation as InvitationAccount}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
