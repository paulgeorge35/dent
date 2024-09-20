"use client";

import AddMServiceDialog from "./add-dialog";

export function ServicesTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddMServiceDialog />
    </div>
  );
}
