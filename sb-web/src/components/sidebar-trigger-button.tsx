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
        className="fill-sidebar-accent-foreground"
        size="lg"
      >
        Collapse
        <ChevronsLeft className="ml-auto min-h-6 min-w-6" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
