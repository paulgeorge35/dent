import { Shell } from "@/components/layout/shell";
import { SpecialitiesTable } from "@/components/specialities-table/table";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Specialities",
});

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  age: z.string().optional(),
});

export interface SpecialitiesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SpecialitiesPage(props: SpecialitiesPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsSchema.parse(searchParams);
  const specialities = await api.speciality.list({ ...search });
  return (
    <Shell>
      <SpecialitiesTable specialities={specialities} />
    </Shell>
  );
}
