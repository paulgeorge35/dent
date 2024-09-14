"use client";

import type { UserComplete } from "@/types/schema";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import AvatarComponent from "@/components/shared/avatar-component";
import { translations } from "@/lib/translations";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WorkingHoursComponent } from "./working-hours";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({ t }: GetColumnsProps): ColumnDef<UserComplete>[] {
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
            <AvatarComponent
              src={row.original.profile.avatar?.url}
              alt={"Profile picture"}
              fallback={`${row.original.profile.firstName} ${row.original.profile.lastName}`}
              className="size-8"
              width={40}
              height={40}
              randomColor
            />
            <span className="vertical items-start">
              {`${row.original.profile.firstName} ${row.original.profile.lastName}`}
              <span className="text-sm text-muted-foreground">
                {row.original.speciality?.name}
              </span>
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "speciality",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.speciality.label")}
        />
      ),
      cell: ({ row }) => {
        return <div>{row.original.speciality?.name}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "contact",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.contact.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="vertical grow items-start">
            <div>{row.original.profile.phone}</div>
            <a
              className="text-link hover:text-link-hover"
              href={`mailto:${row.original.profile.email}`}
            >
              {row.original.profile.email}
            </a>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "workingHours",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.workingHours.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v grow">
            <WorkingHoursComponent
              workingHours={row.getValue("workingHours")}
            />
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.role.label")} />
      ),
      cell: ({ row }) => {
        return (
          <Badge>
            <div className="grow">
              {translations.en.user.role[row.original.role]}
            </div>
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div>
            <Link href={`/user/${row.original.id}`}>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
}
