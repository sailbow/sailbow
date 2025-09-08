/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Progress } from "@/components/ui/progress";
import { Poll } from "./types";
import { Doc, Id } from "@convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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

  const getPercentage = (votes: number): number => {
    const denominator = poll.settings.allowMultiple
      ? poll.responses.length
      : flatResponseData.length;
    return denominator > 0 ? (votes / denominator) * 100 : 0;
  };

  return (
    <div className="flex flex-col justify-center space-y-4">
      <TooltipProvider delayDuration={200}>
        {flatResponseData.map((option) => {
          const percentage = getPercentage(option.count);

          return (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <span className="text-sm">{option.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {percentage.toFixed(1)}%
                      </div>
                      <div className="text-nowrap text-xs text-muted-foreground">
                        {option.count.toLocaleString()} vote(s)
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-3 dark:bg-background"
                  />
                </div>
              </TooltipTrigger>
              {!poll.settings.incognitoResponses && (
                <TooltipContent>
                  <CustomTooltipContent data={option} />
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}

function CustomTooltipContent({ data }: { data: DataItem }) {
  return (
    <div className="max-w-md">
      {data.count < 1 && (
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
