import Calendar from "@/app/_components/calendar/calendar";
import { Shell } from "@/components/shell";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

export const metadata = constructMetadata({
  page: "Home",
});

export default async function Home() {
  const appointments = await api.appointment.getMany();

  return (
    <Shell className="p-0 md:p-4">
      <section className="grid w-full grow grid-cols-1">
        <Calendar appointments={appointments} />
      </section>
    </Shell>
  );
}
