"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TripSidebarTrigger() {
  const { open, isMobile, openMobile } = useSidebar();

  if (!isMobile && open) return;
  if (isMobile && openMobile) return;

  return <SidebarTrigger className="fixed bottom-4 left-1 z-50 h-6 w-6" />;
}
