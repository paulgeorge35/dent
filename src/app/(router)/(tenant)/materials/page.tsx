import { Shell } from "@/components/layout/shell";
import { MaterialTable } from "@/components/material-table/table";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Staff",
});

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
});

export interface MaterialsPageProps {
  searchParams: SearchParams;
}

export default async function Materials({ searchParams }: MaterialsPageProps) {
  const search = searchParamsSchema.parse(searchParams);
  const materials = await api.material.list(search);

  return (
    <Shell>
      <MaterialTable materials={materials} />
    </Shell>
  );
}
