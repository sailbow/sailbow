"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Poll } from "./types";
import { Id } from "@convex/_generated/dataModel";

export function PollResultsChart({ poll }: { poll: Poll }) {
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
