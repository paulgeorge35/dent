"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Material } from "prisma/generated/zod";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Info } from "lucide-react";
import { useLocale } from "next-intl";
import AvatarComponent from "../shared/avatar-component";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import MaterialRowActions from "./row-actions";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({ t }: GetColumnsProps): ColumnDef<Material>[] {
  const locale = useLocale();
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.name.label")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2">
            <AvatarComponent
              src={row.original.image}
              alt={row.original.name}
              fallback={row.original.name}
              className="size-8"
              width={40}
              height={40}
              randomColor
            />
            {row.getValue("name")}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "unit_price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.unit_price.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2 group">
            <span className="font-medium">
              {Number((row.getValue("unit_price") as number) / 100).toFixed(2)}
            </span>
            <span className="font-light text-muted-foreground">
              / {row.original.unit}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.stock.label")}
        />
      ),
      cell: ({ row }) => {
        return row.original.keepInventory ? (
          <div className="horizontal center-v gap-2 group">
            {`${row.original.stock} ${row.original.unit}`}
          </div>
        ) : (
          <div>
            <Tooltip>
              <TooltipTrigger className="italic text-muted-foreground horizontal center-v gap-2">
                {t("no-inventory")}
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                {t("fields.keepInventory.description")}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.tags.label")} />
      ),
      cell: ({ row }) => {
        return <div>{row.original.tags.map((tag) => tag).join(", ")}</div>;
      },
      enableSorting: false,
    },
    {
      id: "search",
      accessorKey: "search",
      header: "",
      enableColumnFilter: true,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div>
            <MaterialRowActions material={row.original} disabled={false} />
          </div>
        );
      },
    },
  ];
}
