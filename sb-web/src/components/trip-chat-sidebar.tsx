"use client";

import { useActiveTripId, useTripConversation } from "@/lib/trip-queries";
import { MessageComposer, MessageChannel } from "./message-channel";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";
import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

const TripChatMessageContainer = () => {
  const { isLoading, results } = useTripConversation();
  return (
    <MessageChannel
      messagesLoading={isLoading}
      messages={results}
      onDeleteMessage={() => {}}
    />
  );
};

const TripChatMessageComposer = () => {
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
  return <MessageComposer sendMessage={sendMessage} />;
};

export function TripChatSidebar({
  ...props
}: Omit<React.ComponentProps<typeof Sidebar>, "sidebarId">) {
  const { tripId } = useParams<{ tripId?: Id<"trips"> }>();
  if (!tripId) return;
  return (
    <Sidebar {...props} side="right" sidebarId="tripChat" variant="sidebar">
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-sidebar-foreground">
            Trip Chat
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <TripChatMessageContainer />
      </SidebarContent>
      <SidebarFooter>
        <TripChatMessageComposer />
      </SidebarFooter>
      {/* <SidebarRail sidebarId="tripChat" /> */}
    </Sidebar>
  );
}
