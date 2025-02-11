import React from "react";
import ConvexAuthenticated from "./convex-authenticated";
import { Toaster } from "@/components/ui/toast";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthenticated>
      <SidebarProvider>
        <AppSidebar className="z-[100]" />
        <SidebarInset>
          <div className="sticky top-0 z-[75] flex pl-2 pt-3">
            <SidebarTrigger />
          </div>
          <div className="flex-grow">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors={true} />
    </ConvexAuthenticated>
  );
}
