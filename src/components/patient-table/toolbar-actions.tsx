"use client";

import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { type Patient } from "prisma/generated/zod";
import { Plus } from "lucide-react";

interface PatientsTableToolbarActionsProps {
  table: Table<Patient>;
}

export function PatientsTableToolbarActions({}: PatientsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button>
        <Plus className="mr-2 size-4" /> Add Patient
      </Button>
    </div>
  );
}
