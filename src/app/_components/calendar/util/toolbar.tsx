import type FullCalendar from "@fullcalendar/react";
import { type RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users,
} from "lucide-react";
import { DateTime } from "luxon";
import renderTitle from "./renderTitle";
import { Separator } from "@/components/ui/separator";
import { SwitchView } from "@/components/ui/switch-enhanced";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, Profile, Event, Patient } from "@prisma/client";
import AvatarComponent from "@/components/avatar-component";
import { useRouter } from "next/navigation";

interface CalendarToolbarProps {
  period: "day" | "week";
  selectedUser: string;
  setPeriod: (period: "day" | "week") => void;
  calendarRef: RefObject<FullCalendar>;
  users?: (User & {
    profile: Profile;
    events: (Event & {
      patient: Patient | null;
    })[];
  })[];
}

export default function CalendarToolbar({
  period,
  selectedUser,
  setPeriod,
  calendarRef,
  users,
}: CalendarToolbarProps) {
  const calendar = calendarRef.current?.getApi();
  const router = useRouter();
  if (!calendar) return;

  const appointments = users?.flatMap((user) => user.events);

  return (
    <section className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
      <div className="flex items-center justify-start gap-2">
        <CalendarCheck className="size-14 rounded-lg bg-muted p-3 text-muted-foreground" />
        <span className="text-3xl font-medium">
          {appointments?.length ?? "-"}
        </span>
        <span className="text-lg text-muted-foreground/80">
          total appointments
        </span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          className=""
          onClick={() => calendarRef.current?.getApi().today()}
          disabled={
            calendarRef.current?.getApi().view.activeStart &&
            calendarRef.current?.getApi().view.activeStart <=
              DateTime.local().toJSDate() &&
            calendarRef.current?.getApi().view.activeEnd &&
            calendarRef.current?.getApi().view.activeEnd >
              DateTime.local().toJSDate()
          }
        >
          Today
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="mr-[-12px] rounded-full text-muted-foreground"
          onClick={() => calendarRef.current?.getApi().prev()}
        >
          <ChevronLeft />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground"
          onClick={() => calendarRef.current?.getApi().next()}
        >
          <ChevronRight />
        </Button>
        {renderTitle(calendarRef)}
        <Separator orientation="vertical" />
        {selectedUser !== "all" && (
          <SwitchView
            disabled={selectedUser === "all"}
            checked={period === "week"}
            values={[
              {
                value: "day",
                label: "Day",
              },
              {
                value: "week",
                label: "Week",
              },
            ]}
            onCheckedChange={(value) => setPeriod(value ? "week" : "day")}
          />
        )}
      </div>
      <div className="flex justify-end">
        <Select
          value={selectedUser}
          onValueChange={(value) => router.push(`/appointments/${value}`)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectItem value="me">
                <div className="flex items-center gap-2">
                  <UserIcon className="size-5" />
                  Only me
                </div>
              </SelectItem>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  All dentists
                </div>
              </SelectItem>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <AvatarComponent
                      src={user.profile.avatar}
                      alt={`${user.profile.firstName} ${user.profile.lastName}`}
                      fallback={`${user.profile.firstName} ${user.profile.lastName}`}
                      className="size-5"
                      width={20}
                      height={20}
                    />
                    {user.profile.firstName} {user.profile.lastName}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
