import { Shell } from "@/components/layout/shell";
import { UserTable } from "@/components/user-table/table";
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
  specialization: z.string().optional(),
  role: z.string().optional(),
  county: z.string().optional(),
});

export interface StaffPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Staff(props: StaffPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsSchema.parse(searchParams);
  const users = await api.user.getAll({ ...search });

  return (
    <Shell>
      <UserTable users={users} />
    </Shell>
  );
}
