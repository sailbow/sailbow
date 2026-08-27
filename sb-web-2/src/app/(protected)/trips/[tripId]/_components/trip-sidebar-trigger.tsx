"use client";

import TripChatDrawer from "@/app/_components/trip-chat-drawer";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessagesSquare, PanelRightClose } from "lucide-react";
import { useState } from "react";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      <Button
        data-sidebar="trigger"
        size="icon"
        variant="outline"
        onClick={() => {
          if (isMobile) {
            setDrawerOpen((cur) => !cur);
          } else {
            toggleSidebar();
          }
        }}
        className="absolute bottom-4 right-4 z-50 size-10 [&_svg]:size-6"
      >
        {(open && !isMobile) || (drawerOpen && isMobile) ? (
          <PanelRightClose />
        ) : (
          <MessagesSquare />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <TripChatDrawer
        open={drawerOpen && isMobile}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
};
