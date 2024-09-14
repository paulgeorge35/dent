"use client";

import AddPatientDialog from "./add-dialog";

export function PatientsTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddPatientDialog />
    </div>
  );
}
