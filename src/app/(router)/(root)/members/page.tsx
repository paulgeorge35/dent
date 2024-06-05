import { PageHeader } from "@/app/_components/page-header";
import { UserTable } from "@/app/_components/user-table/table";
import { api } from "@/trpc/server";
import { type SearchParams } from "@/types";
import { z } from "zod";
import { constructMetadata } from "@/lib/utils";

import { Shell } from "@/components/shell";

import checkAccess from "@/components/security/access-control";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  status: z.string().optional(),
  role: z.string().optional(),
  county: z.string().optional(),
});

export const metadata = constructMetadata({
  page: "Members",
});

export interface MembersPageProps {
  searchParams: SearchParams;
}

export default async function Members({ searchParams }: MembersPageProps) {
  const search = searchParamsSchema.parse(searchParams);

  await checkAccess({
    membersOnly: true,
  });

  const users = await api.user.getAll({ ...search });

  return (
    <Shell className="flex flex-col items-start">
      <PageHeader
        icon="👥"
        title="Members"
        subtitle="View and manage your members."
      />
      <UserTable users={users} />
    </Shell>
  );
}
