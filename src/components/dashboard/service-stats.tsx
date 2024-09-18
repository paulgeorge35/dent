"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

export default function CommonTreatments({ services, className }: StatsProps) {
  const chartConfig = {
    count: {
      label: "Treatments",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const chartData = services.map((service) => ({
    name: service.name,
    count: service.count,
  }));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex justify-between">Common Treatments</CardTitle>
        <CardDescription>
          Here are some stats about your most common treatments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[400px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
