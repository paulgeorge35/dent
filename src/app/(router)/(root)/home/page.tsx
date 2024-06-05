import { Shell } from "@/components/shell";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Home",
});

export default async function Home() {
  return (
    <Shell className="p-0 md:p-4">
      <section className="grid grow grid-cols-12"></section>
    </Shell>
  );
}
