"use client";

import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableFilterField } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import type { Material } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getColumns } from "./columns";
import { MaterialsTableToolbarActions } from "./toolbar-actions";

interface MaterialsTableProps {
  materials: {
    content: Material[];
    count: number;
    pageCount: number;
  };
}

export function MaterialTable({ materials }: MaterialsTableProps) {
  const t = useTranslations("page.materials");
  const { content, pageCount } = materials;

  const columns = React.useMemo<ColumnDef<Material>[]>(
    () => getColumns({ t }),
    [],
  );

  const filterFields: DataTableFilterField<Material>[] = [];

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
        <MaterialsTableToolbarActions />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
