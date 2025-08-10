import React from "react";
import ConvexAuthenticated from "./convex-authenticated";
import { Toaster } from "@/components/ui/toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TripSidebarTrigger from "./[tripId]/_components/trip-sidebar-trigger";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthenticated>
      <SidebarProvider>
        <AppSidebar className="z-40" />
        <SidebarInset className="bg-background">
          <TripSidebarTrigger />
          <div className="@container flex-grow">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors={true} />
    </ConvexAuthenticated>
  );
}
