import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { type InvitationAccount } from "@/types/schema";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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

type InvitationCardProps = {
  invitation: InvitationAccount;
};

function InvitationCard({ invitation }: InvitationCardProps) {
  const tenantAvatar = invitation.user.tenant.profile.avatar;
  return (
    <div className="flex items-center px-6 py-2 [&:not(:last-child)]:border-b">
      <Avatar className="size-12 rounded-sm">
        {tenantAvatar && (
          <Image
            src={tenantAvatar}
            alt={invitation.user.tenant.profile.name}
            width={48}
            height={48}
          />
        )}
        <AvatarFallback className="rounded-sm">
          {invitation.user.tenant.profile.name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex flex-col">
        <h3 className="text-left text-lg font-bold">
          {invitation.user.tenant.profile.name}
        </h3>
        <div className="flex flex-row items-center gap-2">
          {invitation.user.tenant.users.slice(0, 5).map((user) => (
            <Avatar
              key={user.profile.firstName}
              className="relative size-4 rounded-sm border border-background [&:not(:first-child)]:ml-[-12px]"
            >
              {user.profile.avatar && (
                <Image
                  src={user.profile.avatar}
                  alt={user.profile.firstName}
                  width={16}
                  height={16}
                />
              )}
              <AvatarFallback className="rounded-sm">
                {user.profile.firstName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          ))}
          <p className="text-sm text-muted-foreground">
            {invitation.user.tenant.users.length}{" "}
            {invitation.user.tenant.users.length > 1 ? "users" : "user"}
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <Button variant="expandIcon" Icon={ArrowRight} iconPlacement="right">
          Join
        </Button>
      </div>
    </div>
  );
}
