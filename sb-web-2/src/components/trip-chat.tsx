import { useTripConversation, useActiveTripId } from "@/lib/trip-queries";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { MessageComposer, MessageChannel } from "./message-channel";

export const TripChatMessageContainer = () => {
  const { isLoading, results } = useTripConversation();
  return (
    <MessageChannel
      messagesLoading={isLoading}
      messages={results}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onDeleteMessage={() => {}}
    />
  );
};

export const TripChatMessageComposer = () => {
  const activeTripId = useActiveTripId();
  const [isSendMessageLoading, setIsSendMessageLoading] = useState(false);
  const sendMessageMutation = useMutation(
    api.trips.mutations.sendTripConversationMessage,
  );
  const sendMessage = async (message: string) => {
    if (isSendMessageLoading) return;
    setIsSendMessageLoading(true);
    void sendMessageMutation({
      tripId: activeTripId,
      message,
    }).finally(() => setIsSendMessageLoading(false));
  };
  return <MessageComposer className="w-full" sendMessage={sendMessage} />;
};
