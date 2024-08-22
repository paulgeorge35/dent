"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type SessionUser, type TenantAccount } from "@/types/schema";
import AvatarComponent from "./avatar-component";
import {
  CheckIcon,
  ChevronDown,
  DoorOpen,
  Settings,
  SquareActivity,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { toggleTenant } from "@/app/(router)/(tenant)/welcome/actions";
import LogoutDialog from "@/app/_components/auth/logout-dialog";

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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

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

  const handleButtonClick = (action: () => void) => {
    action();
    setOpen(false);
  };

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
            src={session.avatar}
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
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-row items-center justify-start gap-4 text-xs"
            onClick={() => handleButtonClick(() => router.push("/welcome"))}
          >
            <SquareActivity className="size-4" />
            My clinics
          </Button>
          <Separator />
          <div>
            {accounts.map((account) => (
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
                    "opacity-100": account.tenantId === session.user?.tenantId,
                  })}
                />
                <span className="truncate">{account.tenant.profile.name}</span>
              </Button>
            ))}
          </div>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-row items-center justify-start gap-4 text-xs"
            onClick={() => handleButtonClick(() => router.push("/profile"))}
          >
            <User className="size-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-row items-center justify-start gap-4 text-xs"
            onClick={() => handleButtonClick(() => router.push("/settings"))}
          >
            <Settings className="size-4" />
            Settings
          </Button>
          <LogoutDialog>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-row items-center justify-start gap-4 text-xs text-red-500"
            >
              <DoorOpen className="size-4" />
              Log out
            </Button>
          </LogoutDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
