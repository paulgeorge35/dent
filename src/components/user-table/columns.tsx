"use client";

import { type UserComplete } from "@/types/schema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AvatarComponent from "@/components/shared/avatar-component";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { WorkingHoursComponent } from "./working-hours";
import { translations } from "@/lib/translations";

export function getColumns(): ColumnDef<UserComplete>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" className="ml-2" />
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
            />
            <span className="vertical items-start">
              {`${row.original.profile.firstName} ${row.original.profile.lastName}`}
              <span className="text-sm text-muted-foreground">
                {row.original.specialization?.name}
              </span>
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "specialization",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Specialization" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.specialization?.name}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "contact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
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
        <DataTableColumnHeader column={column} title="Working Days" />
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
        <DataTableColumnHeader column={column} title="Role" />
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
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => router.push(`user/${row.original.id}`)}
                >
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
