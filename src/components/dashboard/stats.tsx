"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { useStateful } from "react-hanger";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "../ui/chart";

type View = "currentWeek" | "lastWeek" | "currentMonth" | "today";

type StatsFormat = {
  period: View;
  startDate: Date;
  endDate: Date;
  dailyStats: {
    date: Date;
    count: number;
  }[];
};

type StatsProps = {
  currentWeek: StatsFormat;
  lastWeek: StatsFormat;
  currentMonth: StatsFormat;
  className?: string;
};

export default function Stats({
  currentWeek,
  lastWeek,
  currentMonth,
  className,
}: StatsProps) {
  const view = useStateful<View>("currentWeek");

  const title = (() => {
    switch (view.value) {
      case "currentWeek":
        return "Appointments this week";
      case "lastWeek":
        return "Appointments last week";
      case "currentMonth":
        return "Appointments this month";
      default:
        return "Appointments";
    }
  })();

  const chartConfig = {
    count: {
      label: "Appointments",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const chartData = (() => {
    switch (view.value) {
      case "currentWeek":
        return currentWeek.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("EEEE"),
          count: stat.count,
        }));
      case "lastWeek":
        return lastWeek.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("EEE, dd LLL"),
          count: stat.count,
        }));
      case "currentMonth":
        return currentMonth.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("dd LLLL"),
          count: stat.count,
        }));
      default:
        return [];
    }
  })();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row justify-between">
        <span className="vertical">
          <CardTitle className="flex justify-between">{title}</CardTitle>
          <CardDescription>
            Here are some stats about your appointments.
          </CardDescription>
        </span>
        <StatsViewSelect view={view.value} setView={view.setValue} />
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[400px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StatsViewSelect({
  view,
  setView,
}: {
  view: View;
  setView: (view: View) => void;
}) {
  return (
    <Select value={view} onValueChange={setView}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="currentWeek">Current Week</SelectItem>
        <SelectItem value="lastWeek">Last Week</SelectItem>
        <SelectItem value="currentMonth">Current Month</SelectItem>
      </SelectContent>
    </Select>
  );
}
