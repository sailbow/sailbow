import React from "react";
import ConvexAuthenticated from "./convex-authenticated";
import { Toaster } from "@/components/ui/toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TripSidebarTrigger from "./[tripId]/_components/trip-sidebar-trigger";
import { TripChatSidebar } from "@/components/trip-chat-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthenticated>
      <TooltipProvider>
        <SidebarProvider sidebarId="primary">
          <AppSidebar className="z-40" />
          <TripSidebarTrigger />
          <SidebarProvider
            sidebarId="tripChat"
            defaultOpen={false}
            width="384px"
          >
            <SidebarInset className="bg-background">
              <div className="max-w-full flex-grow overflow-x-hidden @container">
                {children}
              </div>
            </SidebarInset>
            <TripChatSidebar />
          </SidebarProvider>
          <Toaster richColors={true} />
        </SidebarProvider>
      </TooltipProvider>
    </ConvexAuthenticated>
  );
}
