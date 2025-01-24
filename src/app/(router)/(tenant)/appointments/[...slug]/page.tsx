import { auth } from "@/auth";
import Calendar from "@/components/calendar/components/calendar";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { WorkingHours } from "@/types/schema";
import { z } from "zod";


export const metadata = constructMetadata({
  page: "Appointments",
});

type AppointmentsProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const paramsSchema = z
  .union([z.string(), z.literal("all"), z.literal("me")])
  .default("me");

export default async function Appointments(props: AppointmentsProps) {
  const params = await props.params;
  const selected = paramsSchema.parse(params.slug[0]);
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const me = await api.user.me();

  return (
    <Calendar
      selected={selected}
      userId={session.user.id}
      firstDayOfWeek={me.firstDayOfWeek}
      showWeekends={me.showWeekends}
      workingHours={me.workingHours as WorkingHours[]}
      isAdmin={session.user.role === "ADMIN"}
    />
  );
}
