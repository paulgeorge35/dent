"use client";

import { toggleTenant } from "@/app/(router)/(setup)/welcome/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type InvitationAccount } from "@/types/schema";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type InvitationCardProps = {
  invitation: InvitationAccount;
};

export default function InvitationCard({ invitation }: InvitationCardProps) {
  const [pending, startTransition] = useTransition();
  const { mutateAsync: joinTenant } = api.tenant.join.useMutation({
    onSuccess: () => {
      toast.success("Joined clinic", {
        description: "You can now access all the features of this clinic",
      });
      void toggleTenant(invitation.invitedBy.tenant.id);
    },
  });

  const isActive = invitation.invitedBy.tenant.profile.activeSubscription;

  const handleTenantClick = () => {
    if (isActive) {
      startTransition(() => joinTenant(invitation.token));
    }
  };

  const tenantAvatar = invitation.invitedBy.tenant.profile.avatar;
  return (
    <div className="flex items-center px-6 py-2 [&:not(:last-child)]:border-b">
      <Avatar className="size-12 rounded-sm">
        {tenantAvatar && (
          <Image
            src={tenantAvatar}
            alt={invitation.invitedBy.tenant.profile.name}
            width={48}
            height={48}
          />
        )}
        <AvatarFallback className="rounded-sm">
          {invitation.invitedBy.tenant.profile.name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex flex-col">
        <h3 className="text-left text-lg font-bold">
          {invitation.invitedBy.tenant.profile.name}
        </h3>
        <div className="flex flex-row items-center gap-2">
          {invitation.invitedBy.tenant.users.slice(0, 5).map((user) => (
            <Avatar
              key={user.profile.firstName}
              className="relative size-4 rounded-sm border border-background [&:not(:first-child)]:ml-[-12px]"
            >
              {user.profile.avatar && (
                <Image
                  src={user.profile.avatar.url}
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
            {invitation.invitedBy.tenant.users.length}{" "}
            {invitation.invitedBy.tenant.users.length > 1 ? "users" : "user"}
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <Button
          isLoading={pending}
          variant="expandIcon"
          Icon={ArrowRight}
          iconPlacement="right"
          onClick={handleTenantClick}
        >
          Join
        </Button>
      </div>
    </div>
  );
}
