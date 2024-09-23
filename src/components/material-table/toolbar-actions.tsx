"use client";

import AddMaterialDialog from "./add-dialog";

export function MaterialsTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddMaterialDialog className="h-8" />
    </div>
  );
}
