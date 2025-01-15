"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type StatsFormat = {
  name: string;
  count: number;
}[];

type StatsProps = {
  services: StatsFormat;
  className?: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CommonTreatments({ services, className }: StatsProps) {
  const t = useTranslations("page.dashboard.services");
  const chartConfig = {} satisfies ChartConfig;

  const chartData = services.map((service, index) => ({
    name: service.name,
    value: service.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className={cn("w-full flex-col hidden lg:flex", className)}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center grow">
        <ChartContainer config={chartConfig} className="min-h-[200px] h-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  name={entry.name}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card >
  );
}
