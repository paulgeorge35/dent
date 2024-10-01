"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Material } from "prisma/generated/zod";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Info } from "lucide-react";
import AvatarComponent from "../shared/avatar-component";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({ t }: GetColumnsProps): ColumnDef<Material>[] {
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
            <p className="whitespace-nowrap truncate w-[10em]">
              {row.getValue("name")}
            </p>
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
          <div className="horizontal center-v gap-2 group truncate w-[10em] whitespace-nowrap">
            <span className="font-light px-1 rounded-full bg-muted border border-muted-foreground/20 text-xs text-muted-foreground">
              RON
            </span>
            <span className="font-medium">
              {Number((row.getValue("unit_price") as number) / 100).toFixed(2)}
            </span>
            <span className="font-light text-muted-foreground">
              per {row.original.unit}
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
                <Info className="size-4 shrink-0" />
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
        const tags = row.original.tags;
        const maxTags = 2;
        const displayTags = tags.slice(0, maxTags);
        const hasMoreTags = tags.length > maxTags;

        return tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-40">
            {displayTags.map((tag, index) => (
              <span
                key={index}
                className="bg-muted border border-muted-foreground px-1 rounded-lg text-muted-foreground text-xs whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className="bg-muted border border-muted-foreground px-1 rounded-lg text-muted-foreground text-xs">
                {`+${tags.length - maxTags} more`}
              </span>
            )}
          </div>
        ) : (
          <div className="italic text-muted-foreground">-</div>
        );
      },
      enableSorting: false,
      enableColumnFilter: true,
    },
  ];
}
