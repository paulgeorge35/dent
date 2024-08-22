import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { WorkingHours } from "@/types/schema";

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
          {DAYS_OF_WEEK[day]![0]}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs font-medium">
          {workingHours
            ? `${workingHours.startTime} - ${workingHours.endTime}`
            : "Not working"}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
