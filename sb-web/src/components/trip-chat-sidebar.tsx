"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";
import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { TripChatMessageContainer, TripChatMessageComposer } from "./trip-chat";

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
