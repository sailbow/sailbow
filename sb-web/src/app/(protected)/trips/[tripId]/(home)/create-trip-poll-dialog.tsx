"use client";

import { PollDialog } from "@/components/poll-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useMut } from "@/lib/convex-client-helpers";
import { useActiveTripId } from "@/lib/trip-queries";
import { useDisclosure } from "@/lib/use-disclosure";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

export const CreateTripPollDialog = () => {
  const disclosure = useDisclosure();
  const activeTripId = useActiveTripId();
  const { mutateAsync, isPending } = useMut(api.polls.createTripPoll, {
    onSuccess: () => {
      disclosure.setClosed();
      toast.success("Success!");
    },
    onError: () => {
      toast.error("Something went wrong there", { position: "top-center" });
    },
  });

  return (
    <>
      <Button onClick={disclosure.setOpened}>Start a poll</Button>
      <PollDialog
        {...disclosure}
        title="New trip poll"
        isLoading={isPending}
        onSave={(data) =>
          mutateAsync({
            tripId: activeTripId,
            title: data.title,
            settings: {
              allowMultiple: data.settings.allowMultipleVotes,
              incognitoResponses: data.settings.incognitoResponses,
            },
            options: data.options.map((o) => o.value),
          })
        }
      />
    </>
  );
};
