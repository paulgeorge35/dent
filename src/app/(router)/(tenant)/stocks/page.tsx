import { Shell } from "@/components/layout/shell";
import { constructMetadata } from "@/lib/utils";
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

export interface StocksPageProps {
  searchParams: SearchParams;
}

export default async function Stocks({ searchParams }: StocksPageProps) {
  const search = searchParamsSchema.parse(searchParams);
  console.log(search);

  return <Shell>Stocks</Shell>;
}
