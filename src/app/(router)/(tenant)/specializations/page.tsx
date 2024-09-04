import AddSpecializationDialog from "@/components/specializations/add-dialog";
import SpecializationsTable from "@/components/specializations/table";
import { api } from "@/trpc/server";

export default async function SpecializationsPage() {
  const specializations = await api.specialization.list();
  return (
    <>
      <AddSpecializationDialog />
      <SpecializationsTable specializations={specializations} />
    </>
  );
}
