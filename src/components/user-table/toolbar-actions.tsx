"use client";

import { type Table } from "@tanstack/react-table";

import { type UserComplete } from "@/server/api/routers/user";

import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UsersTableToolbarActionsProps {
  table: Table<UserComplete>;
}

export function UsersTableToolbarActions({}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href="/settings?tab=staff" className={cn(buttonVariants())}>
        <Icons.settings className="mr-2 size-4" /> Manage Staff
      </Link>
    </div>
  );
}
