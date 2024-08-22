"use client";

import { toggleTenant } from "@/app/(router)/(tenant)/welcome/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type TenantAccount } from "@/types/schema";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type TenantCardProps = {
  account: TenantAccount;
};

export default function TenantCard({ account }: TenantCardProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isAdmin = account.role === "ADMIN";
  const isActive = account.tenant.profile.activeSubscription;

  const handleTenantClick = (tenantId: string) => {
    if (isActive) {
      startTransition(() => toggleTenant(tenantId));
    } else {
      if (isAdmin) {
        router.push(`/subscription/resume`);
      }
    }
  };

  const tenantAvatar = account.tenant.profile.avatar;
  return (
    <div
      role="button"
      className={cn(
        "vertical items-start px-6 py-2 [&:not(:last-child)]:border-b gap-2",
        {
          "cursor-default bg-muted opacity-50": pending,
        },
        {
          "group cursor-pointer hover:bg-muted": !pending,
        },
        {
          "pointer-events-none opacity-50": !isActive && !isAdmin,
        },
      )}
      onClick={() => handleTenantClick(account.tenantId)}
    >
      <span className="horizontal center-v w-full">
        <Avatar className="size-12 rounded-sm">
          {tenantAvatar ? (
            <Image
              src={tenantAvatar}
              alt={account.tenant.profile.name}
              width={48}
              height={48}
              className="bg-blue-600/10 object-cover"
            />
          ) : (
            <AvatarFallback className="rounded-sm">
              {account.tenant.profile.name.slice(0, 1)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-4 flex flex-col">
          <h3 className="text-left font-semibold">
            {account.tenant.profile.name}
          </h3>
          <div className="flex flex-row items-center gap-2">
            {account.tenant.users.slice(0, 5).map((user) => (
              <Avatar
                key={user.profile.firstName}
                className="relative size-4 rounded-sm border border-background [&:not(:first-child)]:ml-[-12px]"
              >
                {user.profile.avatar ? (
                  <Image
                    src={user.profile.avatar}
                    alt={user.profile.firstName}
                    width={16}
                    height={16}
                    className="bg-blue-600/10 object-cover"
                  />
                ) : (
                  <AvatarFallback className="rounded-sm">
                    {user.profile.firstName.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
            <p className="text-sm text-muted-foreground">
              {account.tenant.users.length}{" "}
              {account.tenant.users.length > 1 ? "users" : "user"}
            </p>
          </div>
        </div>
        <div className="ml-auto group-hover:text-blue-400">
          {pending ? (
            <div className="flex items-center gap-1">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {isActive ? "Open" : "Reactivate"}
              </p>
              <ArrowRight className="size-4" />
            </div>
          )}
        </div>
      </span>
      {!isActive && (
        <p className="text-sm text-destructive">
          Clinic suspended. Contact your administrator.
        </p>
      )}
    </div>
  );
}
