"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCrew, usePendingAndDeclinedInvites } from "@/lib/trip-queries";
import InviteButton from "../crew/invite-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CaptainTile = () => {
  const { data: crew, isLoading: isCrewLoading } = useCrew();
  const captain = crew?.find((c) => c.role === "captain");
  const isLoading = isCrewLoading;
  return (
    <Card>
      <div className="flex space-x-4 p-4">
        <div className="flex-shrink-0">
          <Avatar className="size-20">
            {isLoading ? (
              <Skeleton className="size-full rounded-full dark:bg-slate-500" />
            ) : (
              <AvatarImage src={captain?.imageUrl} />
            )}
          </Avatar>
        </div>
        <div className="flex flex-1 flex-col space-y-1.5">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-sm dark:bg-slate-500" />
          ) : (
            <>
              <CardTitle className="text-nowrap">
                {`${captain?.firstName ?? ""} ${captain?.lastName ?? ""}`}
              </CardTitle>
              <CardDescription>Captain</CardDescription>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export const CrewTile = () => {
  const { data: crew, isLoading: isCrewLoading } = useCrew();
  const { data: invites, isLoading: areInvitesLoading } =
    usePendingAndDeclinedInvites();

  // const isLoading = true;
  const isLoading = isCrewLoading || areInvitesLoading;

  if (isLoading || !crew || !invites)
    return (
      <Card className="overflow-hidden">
        <Skeleton className="size-full dark:bg-slate-500" />
      </Card>
    );

  const going = crew.length;
  const invited = going - 1 + invites.length;

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <CardTitle>Crew</CardTitle>
          <CardDescription>
            ({going} going, {invited} invited)
          </CardDescription>
          <div className="ml-auto">
            <InviteButton size="sm" variant="outline" />
          </div>
        </div>
        <AvatarGroup users={crew} />
      </CardHeader>
    </Card>
  );
};

const AvatarGroup = ({
  users,
}: {
  users: Array<{ firstName: string; lastName: string; imageUrl: string }>;
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center -space-x-2">
        {users.slice(0, 7).map((user, index) => {
          return (
            <Tooltip key={index}>
              <div className="relative">
                <TooltipTrigger asChild>
                  <Avatar
                    key={index}
                    className={`z-${index} cursor-pointer bg-card ring-2 ring-background transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg`}
                  >
                    <AvatarImage
                      src={user.imageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>{user.firstName}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{`${user.firstName} ${user.lastName}`}</TooltipContent>
              </div>
            </Tooltip>
          );
        })}
        {users.length > 7 && (
          <Avatar className="z-20 text-sm font-medium text-muted-foreground ring-2 ring-background">
            <AvatarFallback>
              +{users.slice(7).reduce((acc) => acc + 1, 0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </TooltipProvider>
  );
};
