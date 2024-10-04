"use client";

import { toggleTenant } from "@/app/(router)/(setup)/welcome/actions";
import AvatarComponent from "@/components/shared/avatar-component";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/spinner";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { TenantAccount } from "@/types/schema";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type TenantCardProps = {
  account: TenantAccount;
};

export default function TenantCard({ account }: TenantCardProps) {
  const t = useTranslations("page.welcome.clinic");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isAdmin = account.role === "ADMIN";
  const isActive = account.tenant.profile.activeSubscription;

  const handleTenantClick = (tenantId: string) => {
    if (isActive) {
      startTransition(() => toggleTenant(tenantId));
    } else {
      if (isAdmin) {
        router.push("/subscription/resume");
      }
    }
  };

  const tenantAvatar = account.tenant.profile.avatar?.url;
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleTenantClick(account.tenantId);
        }
      }}
      className={cn(
        "vertical items-start gap-2 px-6 py-2 [&:not(:last-child)]:border-b",
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
        <AvatarComponent
          src={tenantAvatar}
          alt={account.tenant.profile.name}
          fallback={account.tenant.profile.name}
          width={48}
          height={48}
          className="size-12 rounded-sm"
          randomColor
        />
        <div className="ml-4 flex flex-col">
          <h3 className="text-left font-semibold">
            {account.tenant.profile.name}
          </h3>
          <div className="flex flex-row items-center gap-2">
            {account.tenant.users.slice(0, isDesktop ? 5 : 3).map((user,index) => (
              <Avatar
                key={index}
                className="relative size-4 rounded-sm border border-background [&:not(:first-child)]:ml-[-12px]"
              >
                {user.profile.avatar ? (
                  <Image
                    src={user.profile.avatar.url}
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
              {account.tenant.users.length > 1
                ? t("user.plural")
                : t("user.singular")}
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
                {isActive ? t("open") : t("reactivate")}
              </p>
              <ArrowRight className="size-4" />
            </div>
          )}
        </div>
      </span>
      {!isActive && (
        <p className="text-sm text-destructive">{t("suspended")}</p>
      )}
    </div>
  );
}
