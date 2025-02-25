"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TripSidebarTrigger() {
  const { open, isMobile, openMobile } = useSidebar();

  if (!isMobile && open) return;
  if (isMobile && openMobile) return;

  return <SidebarTrigger className="fixed left-1.5 top-4 z-[75]" />;
}
