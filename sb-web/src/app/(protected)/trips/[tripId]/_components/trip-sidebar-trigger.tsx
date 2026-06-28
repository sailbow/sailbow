"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessagesSquare, PanelRightClose } from "lucide-react";

export default function TripSidebarTrigger() {
  const { open, isMobile, openMobile } = useSidebar("primary");

  if (!isMobile && open) return;
  if (isMobile && openMobile) return;

  return (
    <SidebarTrigger
      sidebarId="primary"
      className="fixed bottom-4 left-4 z-50 h-10 w-10 [&_svg]:size-6"
    />
  );
}

export const TripChatSidebarTrigger = () => {
  const { toggleSidebar, open } = useSidebar("tripChat");
  return (
    <Button
      data-sidebar="trigger"
      size="icon"
      variant="outline"
      onClick={toggleSidebar}
      className="absolute bottom-4 right-4 z-50 size-10 [&_svg]:size-6"
    >
      {open ? <PanelRightClose /> : <MessagesSquare />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
