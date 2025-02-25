"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TripSidebarTrigger() {
  const { open, isMobile, openMobile } = useSidebar();

  if (isMobile && openMobile) return;
  if (open) return;

  return <SidebarTrigger className="fixed left-1.5 top-4 z-[75]" />;
}
