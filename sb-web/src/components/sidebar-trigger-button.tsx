"use client";

import { ChevronsLeft } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";

export default function SidebarTriggerButton() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (isMobile) return;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggleSidebar}
        className="text-sidebar-accent-foreground"
        // className="justify-center"
      >
        <ChevronsLeft className="min-h-6 min-w-6" />
        Collapse menu
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
