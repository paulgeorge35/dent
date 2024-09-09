import { auth } from "@/auth";
import { constructMetadata } from "@/lib/utils";
import dynamic from "next/dynamic";
import { z } from "zod";
const Calendar = dynamic(
  () => import("@/components/calendar/components/calendar"),
  {
    ssr: false,
  },
);

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
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  
  return <Calendar selected={selected} userId={session.user.id} />;
}
