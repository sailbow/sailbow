"use client";
import { useActiveTripId, useTripConversation } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../_components/trip-page-components";
import { MessageChannel, MessageComposer } from "@/components/message-channel";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";

export default function Page() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Chat</TripPageTitle>
      </TripPageHeader>
      <TripPageContent>
        <TripChat />
      </TripPageContent>
    </TripPageContainer>
  );
}

const TripChat = () => {
  const { isLoading, loadMore, results, status } = useTripConversation();
  const activeTripId = useActiveTripId();
  const [isSendMessageLoading, setIsSendMessageLoading] = useState(false);
  const sendMessageMutation = useMutation(
    api.trips.mutations.sendTripConversationMessage,
  );
  const sendMessage = async (message: string) => {
    if (isSendMessageLoading) return;
    setIsSendMessageLoading(true);
    await sendMessageMutation({
      tripId: activeTripId,
      message,
    }).finally(() => setIsSendMessageLoading(false));
  };
  return (
    <div className="flex flex-col gap-2">
      <MessageChannel
        className="size-full max-w-xl pb-2"
        messages={results}
        messagesLoading={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDeleteMessage={() => {}}
      />
      <MessageComposer sendMessage={sendMessage} />
    </div>
  );
};
