"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TripSidebarTrigger() {
  const { open, isMobile } = useSidebar();

  if (!isMobile && open) return;

  // return <SidebarTrigger />;
  return <SidebarTrigger className="fixed left-1.5 top-3 z-[75]" />;
}
