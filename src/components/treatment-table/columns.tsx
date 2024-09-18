"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Service } from "prisma/generated/zod";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import AvatarComponent from "../shared/avatar-component";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({ t }: GetColumnsProps): ColumnDef<Service>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("page.treatments.fields.name.label")}
        />
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
          title={t("page.treatments.fields.unit_price.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2">
            <span className="font-light px-1 rounded-full bg-muted border border-muted-foreground/20 text-xs text-muted-foreground">
              RON
            </span>
            <span className="font-medium">
              {Number((row.getValue("unit_price") as number) / 100).toFixed(2)}
            </span>
            {row.original.unit !== "VISIT" && (
              <span className="font-light text-muted-foreground lowercase">
                {`per ${t(`enums.serviceUnit.${row.original.unit}`)}`}
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("page.treatments.fields.duration.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal items-baseline gap-1">
            <span className="text-muted-foreground">~</span>
            {(row.original.duration / 60).toFixed(1)}
            <span className="text-xs text-muted-foreground">
              {t("page.treatments.fields.duration.unit")}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("page.treatments.fields.type.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.unit === "VISIT" ? (
              <span className="bg-purple-500/20 px-2 py-1 rounded-full text-purple-800 font-medium uppercase text-xs">
                {t("page.treatments.fields.type.options.MULTI_VISIT")}
              </span>
            ) : (
              <span className="bg-teal-500/20 px-2 py-1 rounded-full text-teal-800 font-medium uppercase text-xs">
                {t("page.treatments.fields.type.options.SINGLE_VISIT")}
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("page.treatments.fields.tags.label")}
        />
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
