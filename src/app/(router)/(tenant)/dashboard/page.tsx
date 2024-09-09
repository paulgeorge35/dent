import { Shell } from "@/components/layout/shell";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Dashboard",
});

export default async function Dashboard() {
  return (
    <Shell className="grow overflow-y-auto p-0 md:p-4">
      <div className="flex flex-col gap-4">Dashboard</div>
    </Shell>
  );
}
