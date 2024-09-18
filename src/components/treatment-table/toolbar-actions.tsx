"use client";

import AddMaterialDialog from "./add-dialog";

export function ServicesTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddMaterialDialog />
    </div>
  );
}
