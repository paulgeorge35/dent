import { TabsContent } from "@/components/ui/tabs";

import { api } from "@/trpc/server";
import type { WorkingHours } from "@/types/schema";
import DaysOff from "./components/days-off";
import WorkingHoursComponent from "./components/working-hours";

export default async function Schedule() {
  const me = await api.user.me();
  const daysOff = await api.appointment.getDayOffs();
  return (
    <TabsContent
      value="schedule"
      className="!mt-0 flex flex-col gap-4 md:max-w-screen-md"
    >
      <WorkingHoursComponent workingHours={me.workingHours as WorkingHours[]} />
      <DaysOff daysOff={daysOff} />
    </TabsContent>
  );
}
