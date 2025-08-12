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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { AnswerPollDialog } from "@/components/answer-poll-dialog";
import {
  CircleAlertIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PollResultsChart } from "@/components/poll-results-chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisclosure } from "@/lib/use-disclosure";
import LoadingButton from "@/components/loading-button";

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

        const myResponse = poll.responses.find((r) => r.userId === me._id);
        return (
          <Card key={index} className="max-w-3xl">
            <CardHeader>
              <div className="flex w-full gap-4">
                <CardTitle className="flex-1">{poll.title}</CardTitle>
                <div className="ml-auto flex gap-2">
                  {!usersWhoHaveResponded.has(me._id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPoll(poll.tripPollId)}
                    >
                      Respond
                      <CircleAlertIcon className="text-secondary-foreground" />
                    </Button>
                  )}
                  <TripPollActions tripPollId={poll.tripPollId} />
                </div>
              </div>
              <CardDescription>
                {`(${usersWhoHaveResponded.size}/${crew.length})`} responses
              </CardDescription>
            </CardHeader>
            {usersWhoHaveResponded.size > 0 && (
              <CardContent className="space-y-4">
                {myResponse && (
                  <div className="inline-flex w-full gap-2 text-sm">
                    <span className="text-nowrap font-semibold">
                      You responded:
                    </span>
                    {myResponse.choices
                      .map((c) => poll.options.find((o) => o._id === c)?.value)
                      .join(", ")}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPoll(poll.tripPollId)}
                      className="ml-auto"
                    >
                      <span className="hidden xs:block">Edit</span>
                      <Pencil className="size-4 shrink-0" />
                    </Button>
                  </div>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="size-4" />
                      View results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-fit max-h-[80dvh]">
                    <DialogHeader>
                      <DialogTitle>{poll.title}</DialogTitle>
                      <DialogDescription>
                        Poll results ({poll.responses.length}/{crew.length}{" "}
                        responded)
                      </DialogDescription>
                    </DialogHeader>
                    <PollResultsChart
                      poll={poll}
                      users={crew?.map((cm) => ({
                        ...cm,
                        _id: cm.userId as Id<"users">,
                      }))}
                    />
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

const TripPollActions = ({ tripPollId }: { tripPollId: Id<"tripPolls"> }) => {
  const deletePollDialogDisclosure = useDisclosure();
  const {
    mutate: deletePoll,
    isPending: isDeleting,
    isSuccess: didDelete,
    reset,
  } = useMut(api.polls.deleteTripPoll, {
    onSuccess: () => {
      deletePollDialogDisclosure.setClosed();
    },
    onError: () => {
      toast.error("Something went wrong there");
    },
  });
  useEffect(() => {
    if (!deletePollDialogDisclosure.open) {
      reset();
    }
  }, [deletePollDialogDisclosure.open, reset]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 size-4" /> Edit poll
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deletePollDialogDisclosure.setOpened()}
          >
            <Trash className="mr-2 size-4" /> Delete poll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Dialog {...editPollDialogDisclosure}></Dialog> */}
      <Dialog {...deletePollDialogDisclosure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this poll?
            </DialogTitle>
            <DialogDescription>This action cannot be undone!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <LoadingButton
              variant="destructive"
              isLoading={isDeleting || didDelete}
              onClick={() => deletePoll({ tripPollId })}
            >
              Yes, delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
