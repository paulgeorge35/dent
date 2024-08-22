import Calendar from "@/app/_components/calendar/calendar";
import { constructMetadata } from "@/lib/utils";
import { z } from "zod";

export const metadata = constructMetadata({
  page: "Appointments",
});

type AppointmentsProps = {
  params: {
    slug: string[];
  };
};

const paramsSchema = z
  .union([z.string(), z.literal("all"), z.literal("me")])
  .default("me");

export default async function Appointments({ params }: AppointmentsProps) {
  const selected = paramsSchema.parse(params.slug[0]);
  return <Calendar selected={selected} />;
}
