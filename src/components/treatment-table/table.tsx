"use client";

import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableFilterField } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import { api } from "@/trpc/react";
import type { ServiceComplete } from "@/types/schema";
import { useTranslations } from "next-intl";
import { useStateful } from "react-hanger";
import { getColumns } from "./columns";
import EditServiceDialog from "./edit-dialog";
import { ServicesTableToolbarActions } from "./toolbar-actions";

interface ServicesTableProps {
  services: {
    content: ServiceComplete[];
    count: number;
    pageCount: number;
  };
}

export function ServiceTable({ services }: ServicesTableProps) {
  const t = useTranslations("");
  const selectedRow = useStateful<ServiceComplete | null>(null);
  const tServices = useTranslations("page.treatments");
  const { content, pageCount } = services;
  const { data: tags } = api.service.listTags.useQuery();

  const columns = React.useMemo<ColumnDef<ServiceComplete>[]>(
    () => getColumns({ t }),
    [],
  );

  const filterFields: DataTableFilterField<ServiceComplete>[] = [
    {
      label: tServices("fields.search.label"),
      value: "name",
      placeholder: tServices("fields.search.placeholder"),
    },
    {
      label: tServices("fields.tags.label"),
      value: "tags",
      placeholder: tServices("fields.tags.placeholder"),
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
      <EditServiceDialog dialogOpen={selectedRow} />
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        tColumns={tServices}
      >
        <ServicesTableToolbarActions />
      </DataTableToolbar>
      <DataTable
        table={table}
        onRowClick={(value) => selectedRow.setValue(value)}
      />
    </div>
  );
}
