"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
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
  name: string;
  count: number;
}[];

type StatsProps = {
  services: StatsFormat;
  className?: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CommonTreatments({ services, className }: StatsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const radius = useMemo(() => (isDesktop ? "80%" : "50%"), [isDesktop]);
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
          Common Treatments
        </CardTitle>
        <CardDescription>
          Here are some stats about your most common treatments.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center grow">
        <ChartContainer config={chartConfig} className="min-h-[200px] h-full">
          <ResponsiveContainer width="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={radius}
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
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
