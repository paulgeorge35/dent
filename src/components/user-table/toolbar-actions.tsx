"use client";

import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function UsersTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/settings?tab=staff" className={cn(buttonVariants())}>
        <Icons.settings className="mr-2 size-4" /> Manage Staff
      </Link>
    </div>
  );
}
