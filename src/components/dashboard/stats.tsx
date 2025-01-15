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
import { useTranslations } from "next-intl";
import { useStateful } from "react-hanger";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
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
  locale: "en" | "ro";
};

export default function Stats({
  currentWeek,
  lastWeek,
  currentMonth,
  className,
  locale,
}: StatsProps) {
  const view = useStateful<View>("currentWeek");
  const t = useTranslations("page.dashboard.stats");

  const title = (() => {
    switch (view.value) {
      case "currentWeek":
        return t("current-week.title");
      case "lastWeek":
        return t("last-week.title");
      case "currentMonth":
        return t("current-month.title");
      default:
        return t("title");
    }
  })();

  const chartConfig = {
    count: {
      label: t("title"),
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const chartData = (() => {
    switch (view.value) {
      case "currentWeek":
        return currentWeek.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("EEEE", { locale }),
          count: stat.count,
        }));
      case "lastWeek":
        return lastWeek.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("EEE, dd LLL", {
            locale,
          }),
          count: stat.count,
        }));
      case "currentMonth":
        return currentMonth.dailyStats.map((stat) => ({
          date: DateTime.fromJSDate(stat.date).toFormat("dd LLLL", { locale }),
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
          <CardDescription>{t("description")}</CardDescription>
        </span>
        <StatsViewSelect view={view.value} setView={view.setValue} />
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[400px] w-full"
        >
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
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
  const t = useTranslations("page.dashboard.stats");
  return (
    <Select value={view} onValueChange={setView}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="currentWeek">{t("current-week.option")}</SelectItem>
        <SelectItem value="lastWeek">{t("last-week.option")}</SelectItem>
        <SelectItem value="currentMonth">{t("current-month.option")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
