"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { cn } from "@/lib/utils";
import type { SpecialityUserCount } from "@/server/api/routers/user";
import SpecialityRowActions from "../specialities/row-actions";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({
  t,
}: GetColumnsProps): ColumnDef<SpecialityUserCount>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.name.label")}
          className="ml-2"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v grow gap-2">
            <span
              className={cn("size-2 rounded-full shrink-0", {
                "bg-blue-500": row.original.color === "blue",
                "bg-green-500": row.original.color === "green",
                "bg-red-500": row.original.color === "red",
                "bg-yellow-500": row.original.color === "yellow",
                "bg-purple-500": row.original.color === "purple",
                "bg-pink-500": row.original.color === "pink",
                "bg-orange-500": row.original.color === "orange",
                "bg-gray-500": row.original.color === "gray",
              })}
            />
            <div className="grow whitespace-nowrap w-[10em] truncate">
              {row.getValue("name")}
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.description.label")}
        />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("description")}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "users",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => {
        return (
          <div className="vertical grow items-start">
            {row.original._count.users} {t("fields.users.unit")}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div>
            <SpecialityRowActions
              speciality={row.original}
              disabled={row.original._count.users > 0}
            />
          </div>
        );
      },
    },
  ];
}
