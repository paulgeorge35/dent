"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Patient } from "prisma/generated/zod";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import Clipboard from "@/components/ui/clipboard";
import { ArrowRight, MailIcon, PhoneIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import Link from "next/link";
import AvatarComponent from "../shared/avatar-component";
import { Button } from "../ui/button";

type GetColumnsProps = {
  t: (v: string, options?: Record<string, string>) => string;
};

export function getColumns({ t }: GetColumnsProps): ColumnDef<Patient>[] {
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
              src={""}
              alt={"Profile picture"}
              fallback={`${row.original.firstName} ${row.original.lastName}`}
              className="size-8"
              width={40}
              height={40}
              randomColor
            />
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.phone.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2 group">
            <PhoneIcon className="size-4 shrink-0" />
            <a
              className="text-link hover:text-link-hover text-nowrap"
              href={`tel:${row.original.phone}`}
            >
              {row.original.phone}
            </a>
            {row.original.phone && (
              <Clipboard
                text={row.original.phone}
                className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.email.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2 group">
            <MailIcon className="size-4" />
            <a
              className="text-link hover:text-link-hover"
              href={`mailto:${row.original.email}`}
            >
              {row.original.email}
            </a>
            {row.original.email && (
              <Clipboard
                text={row.original.email}
                className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.age.label")} />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.dob
              ? `${DateTime.now()
                  .diff(DateTime.fromJSDate(row.original.dob), "years")
                  .years.toFixed(0)} ${t("fields.age.unit")}`
              : "-"}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("fields.createdAt.label")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {DateTime.fromJSDate(row.original.createdAt).toRelative({
              locale,
            })}
          </div>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div>
            <Link href={`/patient/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
              >
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
}
