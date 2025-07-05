"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Poll } from "./types";
import { Id } from "@convex/_generated/dataModel";
import { o } from "node_modules/framer-motion/dist/types.d-B_QPEvFK";

export const description = "A bar chart with a custom label";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function PollResultsChart({
  // open,
  // onOpenChange,
  poll,
}: {
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
  poll: Poll;
}) {
  console.log(poll);
  const responsesByChoice = new Map<
    Id<"pollOptions">,
    { id: Id<"pollOptions">; label: string; count: number }
  >();
  poll.options.forEach((o) => {
    responsesByChoice.set(o._id, { id: o._id, label: o.value, count: 0 });
  });

  poll.responses.forEach((r) => {
    r.choices.forEach((c) => {
      const existingChoice = responsesByChoice.get(c);
      responsesByChoice.set(c, {
        id: c,
        label: poll.options.find((o) => o._id === c)?.value ?? "huh?: " + c,
        count: existingChoice ? existingChoice.count + 1 : 0,
      });
    });
  });

  const flatResponseData = responsesByChoice
    .values()
    .toArray()
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...flatResponseData.map((item) => item.count));
  const domain = maxCount === 0 ? [0, 1] : [0, maxCount];
  return (
    <div className="w-full">
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="w-full"
      >
        <BarChart
          accessibilityLayer
          data={flatResponseData}
          layout="vertical"
          margin={{
            left: 60,
            right: 80,
            top: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={domain}
            hide
          />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            tickMargin={10}
            className="text-base"
            axisLine={false}
            width={70}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[0, 4, 4, 0]}
            minPointSize={5}
          >
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground text-base"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
