"use client";

import AddServiceDialog from "./add-dialog";

export function ServicesTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddServiceDialog className="h-8" />
    </div>
  );
}
