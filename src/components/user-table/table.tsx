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

import { useTranslations } from "next-intl";
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
  const t = useTranslations("page.staff");
  const { content, pageCount } = users;

  const { data: specialities } = api.tenant.specialities.useQuery();

  const columns = React.useMemo<ColumnDef<UserComplete>[]>(
    () => getColumns({ t }) as ColumnDef<UserComplete>[],
    [],
  );

  const filterFields: DataTableFilterField<UserComplete>[] = [
    {
      label: t("fields.speciality.label"),
      value: "speciality",
      options: specialities?.map((speciality) => ({
        label: speciality.name,
        value: speciality.id,
        withCount: true,
      })),
    },
    {
      label: t("fields.role.label"),
      value: "role",
      options: Object.values(RoleSchema.Values).map((role) => ({
        label: t(`fields.role.options.${role}`),
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
      <DataTableToolbar table={table} filterFields={filterFields} tColumns={t}>
        <UsersTableToolbarActions />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
