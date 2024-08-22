import React from "react";
import { buttonVariants } from "@/components/ui/button";
import AvatarComponent from "@/components/avatar-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Invitation {
  id: string;
  email: string;
  invitedBy: {
    profile: {
      firstName: string;
      lastName: string;
      email: string;
    };
    tenant: {
      profile: {
        name: string;
        avatar: string | null;
      };
    };
  };
}

interface InvitePageContentProps {
  invitation: Invitation;
}

const InvitePageContent: React.FC<InvitePageContentProps> = ({
  invitation,
}) => {
  const { name: tenantName, avatar: tenantAvatar } =
    invitation.invitedBy.tenant.profile;
  const { firstName, lastName } = invitation.invitedBy.profile;
  const inviterName = `${firstName} ${lastName}`;
  const inviteeEmail = invitation.email;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="flex flex-col items-center">
        <AvatarComponent
          src={tenantAvatar}
          alt={tenantName}
          fallback={tenantName}
          width={100}
          height={100}
          className="mb-4 size-16 rounded-sm"
        />
        <CardTitle className="text-center text-3xl">
          Join {tenantName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          You&apos;ve been invited by{" "}
          <span className="font-semibold">{inviterName}</span> to join{" "}
          <span className="font-semibold">{tenantName}</span>.
        </CardDescription>
        <p className="text-sm">
          Invitation sent to:{" "}
          <span className="font-mono text-muted-foreground">
            {inviteeEmail}
          </span>
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/sign-up?email=${inviteeEmail}`}
          className={cn(
            buttonVariants({ variant: "ringHover" }),
            "w-full text-lg font-semibold",
          )}
        >
          Accept Invitation
        </Link>
        <p className="text-sm text-muted-foreground">
          You can view your invitations once you&apos;ve signed up.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InvitePageContent;
