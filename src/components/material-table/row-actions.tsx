import type { Material } from "@prisma/client";
import DeleteMaterialDialog from "./delete-dialog";
import EditMaterialDialog from "./edit-dialog";


type MaterialRowActionsProps = {
  material: Material;
  disabled: boolean;
};

export default function MaterialRowActions({
  material,
  disabled,
}: MaterialRowActionsProps) {
  return (
    <span className="center gap-2 opacity-0 group-hover:opacity-100">
      <EditMaterialDialog material={material} />
      <DeleteMaterialDialog id={material.id} disabled={disabled} />
    </span>
  );
}
