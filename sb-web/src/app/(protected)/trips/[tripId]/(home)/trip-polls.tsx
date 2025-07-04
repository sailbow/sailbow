"use client";

import { useActiveTripId } from "@/lib/trip-queries";
import { useMut, useQueryWithStatus } from "@/lib/convex-client-helpers";
import { api } from "@convex/_generated/api";
import CenteredSpinner from "@/app/_components/centered-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Id } from "@convex/_generated/dataModel";
import { useMe } from "@/lib/user-queries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { AnswerPollDialog } from "@/components/answer-poll-dialog";

export const TripPolls = () => {
  const activeTripId = useActiveTripId();
  const { isPending, isError, data, error } = useQueryWithStatus(
    api.polls.getTripPolls,
    { tripId: activeTripId },
  );
  const {
    data: me,
    isPending: isMePending,
    isError: getMeError,
    error: meError,
  } = useQueryWithStatus(api.users.queries.me);

  const { mutateAsync: respondToPoll, isPending: isRespondingToPoll } = useMut(
    api.polls.respondToTripPoll,
    {
      onSuccess: () => {
        setSelectedPoll(undefined);
        toast.success("Success!", { position: "top-center" });
      },
      onError: () => {
        toast.error("Something went wrong there");
      },
    },
  );
  const [selectedPoll, setSelectedPoll] = useState<any>();

  if (isError) throw error;
  if (getMeError) throw meError;
  if (isPending || isMePending || !me) return <CenteredSpinner />;
  return (
    <div className="flex w-full flex-col gap-4">
      {data.map((poll, index) => {
        const usersWhoHaveResponded = poll.responses.reduce(
          (acc, value) => acc.add(value.userId),
          new Set<Id<"users">>(),
        );

        return (
          <Card key={index} className="max-w-3xl">
            <CardHeader>
              <div className="flex w-full justify-between gap-4">
                <CardTitle>{poll.title}</CardTitle>
                {!usersWhoHaveResponded.has(me._id) && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPoll(poll)}
                  >
                    Add response
                  </Button>
                )}
              </div>
              <CardDescription>
                {usersWhoHaveResponded.size} responses
              </CardDescription>
            </CardHeader>
            <AnswerPollDialog
              open={selectedPoll?.tripPollId === poll.tripPollId}
              onOpenChange={() => setSelectedPoll(undefined)}
              isLoading={isRespondingToPoll}
              poll={poll}
              handleSubmit={(choices) => {
                return respondToPoll({
                  tripPollId: poll.tripPollId,
                  selectedOptions: choices,
                });
              }}
            />
          </Card>
        );
      })}
    </div>
  );
};
