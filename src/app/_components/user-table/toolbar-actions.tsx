"use client";

import { type Table } from "@tanstack/react-table";

import { type UserComplete } from "@/server/api/routers/user";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

interface UsersTableToolbarActionsProps {
  table: Table<UserComplete>;
}

export function UsersTableToolbarActions({}: UsersTableToolbarActionsProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => router.push("/settings?tab=staff")}>
        <Icons.settings className="mr-2 size-4" /> Manage Staff
      </Button>
    </div>
  );
}
