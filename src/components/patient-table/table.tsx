"use client";

import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableFilterField } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import { useLocale, useTranslations } from "next-intl";
import type { Patient } from "prisma/generated/zod";
import { getColumns } from "./columns";
import { PatientsTableToolbarActions } from "./toolbar-actions";

interface PatientsTableProps {
  patients: {
    content: Patient[];
    count: number;
    pageCount: number;
  };
}

export function PatientTable({ patients }: PatientsTableProps) {
  const t = useTranslations("page.patients");
  const locale = useLocale();
  const { content, pageCount } = patients;

  const columns = React.useMemo<ColumnDef<Patient>[]>(
    () => getColumns({ t, locale }),
    [],
  );

  const filterFields: DataTableFilterField<Patient>[] = [];

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
        <PatientsTableToolbarActions />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
