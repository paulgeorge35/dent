import { Shell } from "@/components/layout/shell";
import { ServiceTable } from "@/components/treatment-table/table";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { SearchParams } from "@/types";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Treatments",
});

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  age: z.string().optional(),
  tags: z.string().optional(),
  name: z.string().optional(),
});

export interface TreatmentsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Treatments(props: TreatmentsPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsSchema.parse(searchParams);
  const services = await api.service.list({ ...search });

  return (
    <Shell>
      <ServiceTable services={services} />
    </Shell>
  );
}
