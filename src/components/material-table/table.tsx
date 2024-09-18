"use client";

import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableFilterField } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import { api } from "@/trpc/react";
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
  const { data: tags } = api.material.listTags.useQuery();

  const columns = React.useMemo<ColumnDef<Material>[]>(
    () => getColumns({ t }),
    [],
  );

  const filterFields: DataTableFilterField<Material>[] = [
    {
      label: t("fields.search.label"),
      value: "name",
      placeholder: t("fields.search.placeholder"),
    },
    {
      label: t("fields.tags.label"),
      value: "tags",
      placeholder: t("fields.tags.placeholder"),
      options: tags?.map((tag) => ({
        label: tag,
        value: tag,
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
        <MaterialsTableToolbarActions />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
