"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { api } from "@/trpc/react";
import type { DataTableFilterField } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { RoleSchema } from "prisma/generated/zod";
import * as React from "react";

import type { UserComplete } from "@/server/api/routers/user";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import { getRoleIcon } from "@/lib/table-utils";

import { getColumns } from "./columns";
import { UsersTableToolbarActions } from "./toolbar-actions";

interface UsersTableProps {
  users: {
    content: UserComplete[];
    count: number;
    pageCount: number;
  };
}

export function UserTable({ users }: UsersTableProps) {
  const { content, pageCount } = users;

  const { data: specializations } = api.tenant.specializations.useQuery();

  const columns = React.useMemo<ColumnDef<UserComplete>[]>(
    () => getColumns() as ColumnDef<UserComplete>[],
    [],
  );

  const filterFields: DataTableFilterField<UserComplete>[] = [
    {
      label: "Specialization",
      value: "specialization",
      options: specializations?.map((specialization) => ({
        label: specialization.name,
        value: specialization.id,
        withCount: true,
      })),
    },
    {
      label: "Role",
      value: "role",
      options: Object.values(RoleSchema.Values).map((role) => ({
        label: role[0]?.toUpperCase() + role.slice(1),
        value: role,
        icon: getRoleIcon(role),
        withCount: true,
      })),
    },
  ];

  const { table } = useDataTable({
    data: content,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UsersTableToolbarActions table={table} />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
