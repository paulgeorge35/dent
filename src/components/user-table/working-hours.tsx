import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { WorkingHours } from "@/types/schema";
import { useTranslations } from "next-intl";

type WorkingHoursComponentProps = {
  workingHours: WorkingHours[];
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const findDay = (day: number, workingHours: WorkingHours[]) => {
  return workingHours.find((workingHour) =>
    workingHour.daysOfWeek.includes(day),
  );
};

export function WorkingHoursComponent({
  workingHours,
}: WorkingHoursComponentProps) {
  return (
    <div className="horizontal gap-1">
      {Array.from([1, 2, 3, 4, 5, 6, 0], (day) => (
        <WorkingDayComponent
          key={day}
          day={day as 0 | 1 | 2 | 3 | 4 | 5 | 6}
          workingHours={findDay(day, workingHours)}
        />
      ))}
    </div>
  );
}

type WorkingDayComponentProps = {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  workingHours?: WorkingHours;
};

const WorkingDayComponent = ({
  day,
  workingHours,
}: WorkingDayComponentProps) => {
  const t = useTranslations(
    "page.settings.tabs.schedule.working-hours",
  );
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            "horizontal center size-5 rounded-full bg-muted text-xs leading-none",
            {
              "bg-blue-500 text-white": workingHours,
            },
          )}
        >
          {t(`days-of-week.${day}`).slice(0, 1)}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs font-medium">
          {workingHours
            ? `${workingHours.startTime} - ${workingHours.endTime}`
            : t("not-working")}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
