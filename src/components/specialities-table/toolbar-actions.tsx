"use client";

import AddSpecialityDialog from "../specialities/add-dialog";

export function SpecialitiesTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <AddSpecialityDialog className="h-8" />
    </div>
  );
}
