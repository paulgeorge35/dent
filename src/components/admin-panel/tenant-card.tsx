import { cn } from "@/lib/utils";
import { Hospital } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type CurrentTenant = {
  tenant?: {
    profile: {
      name: string;
      address: string | null;
    };
  };
  isOpen?: boolean;
  className?: string;
};
export default function CurrentTenant({
  tenant,
  isOpen,
  className,
}: CurrentTenant) {
  if (!tenant) {
    return (
      <div
        className={cn(
          "mx-2 flex h-16 items-center gap-4 rounded-md border border-border p-4 transition-all duration-300",
          { "justify-center px-1": !isOpen },
          className,
        )}
      >
        <Hospital className="size-6" />
        {isOpen && (
          <span className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-20" />
          </span>
        )}
      </div>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div
          className={cn(
            "mx-2 flex h-16 items-center gap-4 rounded-md border border-border p-4 transition-all duration-300",
            { "justify-center px-1": !isOpen },
            className,
          )}
        >
          <Hospital className="size-6 flex-shrink-0" />
          {isOpen && (
            <span className="flex max-w-full flex-col overflow-hidden">
              <p className="truncate text-sm font-semibold">
                {tenant.profile.name}
              </p>
              <p className="h-3 truncate text-xs text-muted-foreground">
                {tenant.profile.address}
              </p>
            </span>
          )}
        </div>
      </TooltipTrigger>
      {!isOpen && <TooltipContent side="right" className="pb-2">
        <p className="truncate text-sm font-semibold">{tenant.profile.name}</p>
        <p className="h-3 truncate text-xs">
          {tenant.profile.address}
        </p>
      </TooltipContent>}
    </Tooltip>
  );
}
