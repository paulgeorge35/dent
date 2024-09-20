import AvatarComponent from "@/components/shared/avatar-component";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SwitchView } from "@/components/ui/switch-enhanced";
import type FullCalendar from "@fullcalendar/react";
import type { Avatar, Event, Patient, Profile, User } from "@prisma/client";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users,
} from "lucide-react";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import AnimatedNumber from "react-animated-numbers";
import renderTitle from "./renderTitle";

interface CalendarToolbarProps {
  period: "day" | "week";
  selectedUser: string;
  setPeriod: (period: "day" | "week") => void;
  calendarRef: RefObject<FullCalendar>;
  users?: (User & {
    profile: Profile & {
      avatar: Avatar | null;
    };
    events: (Event & {
      patient: Patient | null;
    })[];
  })[];
  activeUsers?: (User & {
    profile: Profile & {
      avatar: {
        url: string;
      } | null;
    };
  })[];
}

export default function CalendarToolbar({
  period,
  selectedUser,
  setPeriod,
  calendarRef,
  users,
  activeUsers,
}: CalendarToolbarProps) {
  const t = useTranslations("page.appointments.calendar");
  const calendar = calendarRef.current?.getApi();
  if (!calendar) return;

  const appointments = users
    ?.flatMap((user) => user.events)
    .filter((event) => event.type === "APPOINTMENT");

  return (
    <section className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
      <div className="flex items-center justify-start gap-2 col-span-2 lg:col-span-1">
        <CalendarCheck className="size-14 rounded-lg bg-muted p-3 text-muted-foreground shrink-0" />
        <span className="text-3xl font-medium">
          {appointments ? (
            <AnimatedNumber animateToNumber={appointments.length} />
          ) : (
            "-"
          )}
        </span>
        <span className="text-lg text-muted-foreground/80 lowercase">
          {t("total-appointments")}
        </span>
      </div>
      <div className="justify-end flex lg:hidden col-span-1">
        <SelectResource selectedUser={selectedUser} activeUsers={activeUsers} />
      </div>
      <div className="flex items-center justify-between lg:justify-center gap-4 col-span-3 lg:col-span-1">
        <span className="horizontal center-v gap-2">
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
            {t("today")}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="mr-[-12px] rounded-full text-muted-foreground shrink-0"
            onClick={() => calendarRef.current?.getApi().prev()}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-muted-foreground shrink-0"
            onClick={() => calendarRef.current?.getApi().next()}
          >
            <ChevronRight />
          </Button>
        </span>
        <span className="hidden lg:block">{renderTitle(calendarRef)}</span>
        <Separator orientation="vertical" className="hidden lg:block h-10" />
        <span className="lg:hidden">{renderTitle(calendarRef)}</span>
        {selectedUser !== "all" && (
          <SwitchView
            disabled={selectedUser === "all"}
            checked={period === "week"}
            values={[
              {
                value: "day",
                label: t("view-select.day"),
              },
              {
                value: "week",
                label: t("view-select.week"),
              },
            ]}
            className="hidden lg:block"
            onCheckedChange={(value) => setPeriod(value ? "week" : "day")}
          />
        )}
      </div>
      <div className="justify-end hidden lg:flex col-span-1">
        <SelectResource selectedUser={selectedUser} activeUsers={activeUsers} />
      </div>
      <div />
      <div />
    </section>
  );
}

type SelectResourceProps = {
  selectedUser: string;
  activeUsers?: (User & {
    profile: Profile & {
      avatar: {
        url: string;
      } | null;
    };
  })[];
};
function SelectResource({ selectedUser, activeUsers }: SelectResourceProps) {
  const t = useTranslations("page.appointments.calendar");
  const router = useRouter();
  return (
    <Select
      value={selectedUser}
      onValueChange={(value) => router.push(`/appointments/${value}`)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <SelectGroup>
          <SelectItem value="me">
            <div className="flex items-center gap-2">
              <UserIcon className="size-5" />
              {t("user-select.only-me")}
            </div>
          </SelectItem>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              {t("user-select.all-doctors")}
            </div>
          </SelectItem>
          {activeUsers?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                <AvatarComponent
                  src={user.profile.avatar?.url}
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
  );
}
