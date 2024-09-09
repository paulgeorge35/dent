"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PatientsTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button>
        <Plus className="mr-2 size-4" /> Add Patient
      </Button>
    </div>
  );
}
