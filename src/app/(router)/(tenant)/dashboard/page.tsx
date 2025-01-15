import { auth } from "@/auth";
import CommonTreatments from "@/components/dashboard/service-stats";
import Stats from "@/components/dashboard/stats";
import Upcomming from "@/components/dashboard/upcomming";
import Welcome from "@/components/dashboard/welcome";
import { Shell } from "@/components/layout/shell";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import { getLocale } from "next-intl/server";

export const metadata = constructMetadata({
  page: "Dashboard",
});

export default async function Dashboard() {
  const session = await auth();

  const [today, currentWeek, lastWeek, currentMonth, services, appointments] =
    await Promise.all([
      await api.appointment.stats("today"),
      await api.appointment.stats("currentWeek"),
      await api.appointment.stats("lastWeek"),
      await api.appointment.stats("currentMonth"),
      await api.appointment.commonTreatments(),
      await api.appointment.today(),
    ]);
  const locale = (await getLocale()) as "en" | "ro";

  return (
    <Shell>
      <div className="gap-2 grid grid-cols-6 md:gap-4 max-w-full safe-area">
        <Welcome
          name={`${session?.firstName} ${session?.lastName}`}
          avatar={session?.avatar?.url}
          appointments={today.dailyStats[0]?.count ?? 0}
          className="col-span-6"
        />
        <Stats
          currentWeek={currentWeek}
          lastWeek={lastWeek}
          currentMonth={currentMonth}
          locale={locale}
          className="col-span-6 lg:col-span-4"
        />
        <CommonTreatments services={services} className="col-span-2" />
        <Upcomming appointments={appointments} className="col-span-6" />
      </div>
    </Shell>
  );
}
