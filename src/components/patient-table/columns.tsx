"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Patient } from "prisma/generated/zod";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import Clipboard from "@/components/ui/clipboard";
import { MailIcon, PhoneIcon } from "lucide-react";
import { DateTime } from "luxon";
import AvatarComponent from "../shared/avatar-component";

export function getColumns(): ColumnDef<Patient>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
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
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => {
        return (
          <div className="horizontal center-v gap-2 group">
            <PhoneIcon className="size-4" />
            <a
              className="text-link hover:text-link-hover"
              href={`tel:${row.original.phone}`}
            >
              {row.original.phone}
            </a>
            {row.original.phone && (
              <Clipboard
                text={row.original.phone}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        <DataTableColumnHeader column={column} title="Email" />
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
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        <DataTableColumnHeader column={column} title="Age" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.dob
              ? `${DateTime.now()
                  .diff(DateTime.fromJSDate(row.original.dob), "years")
                  .years.toFixed(0)} years`
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
        <DataTableColumnHeader column={column} title="Registered" />
      ),
      cell: ({ row }) => {
        return (
          <div>{DateTime.fromJSDate(row.original.createdAt).toRelative()}</div>
        );
      },
      enableHiding: false,
      enableSorting: true,
    },
  ];
}
