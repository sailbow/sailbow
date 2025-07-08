/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Poll } from "./types";
import { Doc, Id } from "@convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserData = Omit<Doc<"users">, "externalId">;
interface DataItem {
  id: Id<"pollOptions">;
  label: string;
  count: number;
  users: UserData[];
}

export function PollResultsChart({
  poll,
  users,
}: {
  poll: Poll;
  users?: UserData[];
}) {
  const responsesByChoice = new Map<Id<"pollOptions">, DataItem>();
  poll.options.forEach((o) => {
    responsesByChoice.set(o._id, {
      id: o._id,
      label: o.value,
      count: 0,
      users: [],
    });
  });

  poll.responses.forEach((r) => {
    r.choices.forEach((c) => {
      const existingChoice = responsesByChoice.get(c);
      const user = users?.find((u) => u._id === r.userId);
      responsesByChoice.set(c, {
        id: c,
        label: poll.options.find((o) => o._id === c)?.value ?? "unknown option",
        count: existingChoice ? existingChoice.count + 1 : 0,
        users:
          !poll.settings.incognitoResponses && user
            ? [...(existingChoice?.users ?? []), user]
            : (existingChoice?.users ?? []),
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
    <div className="container mx-auto p-0 px-1">
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <BarChart
          accessibilityLayer
          data={flatResponseData}
          layout="vertical"
          margin={{
            right: 50,
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
            axisLine={false}
            width={150}
          />
          {!poll.settings.incognitoResponses && users && (
            <ChartTooltip content={CustomTooltipContent} />
          )}
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
              className="fill-foreground"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function CustomTooltipContent({ active, payload, label }: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (active && payload?.length) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const data = payload[0].payload as DataItem;

    return (
      <div className="max-w-sm rounded-lg border border-border bg-background p-4 shadow-lg">
        {data.users.length < 1 && (
          <div className="text-xs font-medium text-muted-foreground">
            No responses
          </div>
        )}
        {data.users.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              Responded by:
            </div>
            <div className="max-h-32 space-y-2 overflow-y-auto">
              {data.users.map((user) => (
                <div key={user._id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName} profile picture`}
                    />
                    <AvatarFallback className="text-xs">
                      {user.firstName} {user.lastName}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
