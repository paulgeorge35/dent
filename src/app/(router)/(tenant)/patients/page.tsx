import { Shell } from "@/components/layout/shell";
import { PatientTable } from "@/components/patient-table/table";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Patients",
});

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  age: z.string().optional(),
});

export interface PatientsPageProps {
  searchParams: SearchParams;
}

export default async function Patients({ searchParams }: PatientsPageProps) {
  const search = searchParamsSchema.parse(searchParams);
  const patients = await api.patient.list({ ...search });

  return (
    <Shell>
      <PatientTable patients={patients} />
    </Shell>
  );
}
