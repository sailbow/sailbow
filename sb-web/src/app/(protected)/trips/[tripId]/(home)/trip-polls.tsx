"use client";

import { useActiveTripId, useCrew } from "@/lib/trip-queries";
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
import { CircleAlertIcon, Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PollResultsChart } from "@/components/poll-results-chart";

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

  const {
    data: crew,
    isLoading: isCrewLoading,
    isError: isCrewError,
    error: crewError,
  } = useCrew();

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

  // const { data: responses } = useQueryWithStatus(api.polls.)
  const [selectedPoll, setSelectedPoll] = useState<
    Id<"tripPolls"> | undefined
  >();

  if (isError) throw error;
  if (getMeError) throw meError;
  if (isCrewError) throw crewError;
  if (isPending || isMePending || !me || isCrewLoading || !crew)
    return <CenteredSpinner />;

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
                {!usersWhoHaveResponded.has(me._id) ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPoll(poll.tripPollId)}
                  >
                    Respond
                    <CircleAlertIcon className="ml-2 text-secondary-foreground" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedPoll(poll.tripPollId)}
                  >
                    Edit response
                    <Edit className="ml-2 size-4" />
                  </Button>
                )}
              </div>
              <CardDescription>
                {`(${usersWhoHaveResponded.size}/${crew.length})`} responses
              </CardDescription>
            </CardHeader>
            {usersWhoHaveResponded.size > 0 && (
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 size-4" />
                      View results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Poll results</DialogTitle>
                      <DialogDescription>{poll.title}</DialogDescription>
                    </DialogHeader>
                    <PollResultsChart poll={poll} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            )}
            <AnswerPollDialog
              open={selectedPoll === poll.tripPollId}
              onOpenChange={() => setSelectedPoll(undefined)}
              isLoading={isRespondingToPoll}
              poll={poll}
              userId={me._id}
              handleSubmit={(choices) => {
                return respondToPoll({
                  tripPollId: poll.tripPollId,
                  choices,
                });
              }}
            />
          </Card>
        );
      })}
    </div>
  );
};
