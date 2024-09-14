import type { Speciality } from "@prisma/client";
import DeleteSpecialityDialog from "./delete-dialog";
import EditSpecialityDialog from "./edit-dialog";

type SpecialityRowActionsProps = {
  speciality: Speciality;
  disabled: boolean;
};

export default function SpecialityRowActions({
  speciality,
  disabled,
}: SpecialityRowActionsProps) {
  return (
    <span className="center gap-2 opacity-0 group-hover:opacity-100">
      <EditSpecialityDialog speciality={speciality} />
      <DeleteSpecialityDialog id={speciality.id} disabled={disabled} />
    </span>
  );
}
