"use client";

import { useDataTable } from "@/hooks/use-data-table";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import type { SpecialityUserCount } from "@/server/api/routers/user";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import type { DataTableFilterField } from "@/types";
import { useTranslations } from "next-intl";
import { useStateful } from "react-hanger";
import SpecialityEditDialog from "../specialities/edit-dialog";
import { getColumns } from "./columns";
import { SpecialitiesTableToolbarActions } from "./toolbar-actions";

interface SpecialitiesTableProps {
  specialities: {
    content: SpecialityUserCount[];
    count: number;
    pageCount: number;
  };
}

export function SpecialitiesTable({ specialities }: SpecialitiesTableProps) {
  const t = useTranslations("page.specialities");
  const selectedRow = useStateful<SpecialityUserCount | null>(null);
  const { content, pageCount } = specialities;

  const columns = React.useMemo<ColumnDef<SpecialityUserCount>[]>(
    () => getColumns({ t }) as ColumnDef<SpecialityUserCount>[],
    [t],
  );
  const filterFields: DataTableFilterField<SpecialityUserCount>[] = [];

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
      <SpecialityEditDialog dialogOpen={selectedRow} />
      <DataTableToolbar table={table} filterFields={filterFields} tColumns={t}>
        <SpecialitiesTableToolbarActions />
      </DataTableToolbar>
      <DataTable
        table={table}
        onRowClick={(value) => selectedRow.setValue(value)}
      />
    </div>
  );
}
