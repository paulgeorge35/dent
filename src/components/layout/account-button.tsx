"use client";

import {
  logoutTenant,
  toggleTenant,
} from "@/app/(router)/(setup)/welcome/actions";
import LogoutDialog from "@/components/auth/logout-dialog";
import AvatarComponent from "@/components/shared/avatar-component";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SessionUser, TenantAccount } from "@/types/schema";
import {
  CheckIcon,
  ChevronDown,
  DoorOpen,
  Ellipsis,
  Settings,
  SquareActivity,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const DISPLAY_TENANTS_CUTOFF = 2;

interface AccountButtonProps {
  session: SessionUser;
  accounts: TenantAccount[];
  className?: string;
}

export default function AccountButton({
  session,
  accounts,
  className,
}: AccountButtonProps) {
  const t = useTranslations("layout.sidebar.controls");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [showAllTenants, setShowAllTenants] = useState(false);

  const handleTenantClick = (tenantId: string) => {
    startTransition(() =>
      toggleTenant(tenantId).then(() => {
        router.push("/");
        setOpen(false);
      }),
    );
  };

  const tenant = accounts.find(
    (account) => account.tenantId === session.user?.tenantId,
  )?.tenant;

  useEffect(() => {
    setShowAllTenants(false);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-56 flex-row items-center gap-4 rounded-full py-2 !pl-0",
            className,
          )}
        >
          <AvatarComponent
            src={session.avatar?.url}
            alt={`${session.firstName} ${session.lastName}`}
            fallback={`${session.firstName} ${session.lastName}`}
            className="size-9"
            height={36}
            width={36}
          />
          <span className="flex flex-col items-start overflow-hidden">
            <p className="truncate text-sm font-semibold">
              {session.firstName} {session.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {tenant?.profile.name}
            </p>
          </span>
          <ChevronDown className="ml-auto size-5 flex-shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 shadow-lg" side="bottom" align="end">
        <div className="grid">
          <Link
            href="/welcome"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "flex flex-row items-center justify-start gap-4 text-xs",
            )}
            onClick={async () => {
              await logoutTenant();
              setOpen(false);
            }}
          >
            <SquareActivity className="size-4" />
            {t("my-clinics")}
          </Link>
          <Separator />
          <div>
            {accounts
              .slice(
                0,
                showAllTenants ? accounts.length : DISPLAY_TENANTS_CUTOFF,
              )
              .map((account) => (
                <Button
                  key={account.tenantId}
                  variant="ghost"
                  size="sm"
                  className="flex w-56 flex-row items-center justify-start gap-4 overflow-hidden whitespace-nowrap text-xs"
                  disabled={
                    account.tenantId === session.user?.tenantId || pending
                  }
                  onClick={() => handleTenantClick(account.tenantId)}
                >
                  <CheckIcon
                    className={cn("size-4 flex-shrink-0 font-light opacity-0", {
                      "opacity-100":
                        account.tenantId === session.user?.tenantId,
                    })}
                  />
                  <span className="truncate">
                    {account.tenant.profile.name}
                  </span>
                </Button>
              ))}
          </div>
          {accounts.length > DISPLAY_TENANTS_CUTOFF && !showAllTenants && (
            <button
              className="horizontal center-h bg-muted text-xs text-muted-foreground"
              type="button"
              onClick={() => setShowAllTenants(true)}
            >
              <Ellipsis className="size-4" />
            </button>
          )}
          <Separator />
          <Link
            href="/profile"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "flex flex-row items-center justify-start gap-4 text-xs",
            )}
            onClick={() => setOpen(false)}
          >
            <User className="size-4" />
            {t("profile")}
          </Link>
          <Link
            href="/settings"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "flex flex-row items-center justify-start gap-4 text-xs",
            )}
            onClick={() => setOpen(false)}
          >
            <Settings className="size-4" />
            {t("settings")}
          </Link>
          <LogoutDialog>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-row items-center justify-start gap-4 text-xs text-red-500"
            >
              <DoorOpen className="size-4" />
              {t("logout.trigger")}
            </Button>
          </LogoutDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
