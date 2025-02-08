import React from "react";
import ConvexAuthenticated from "./convex-authenticated";
import { Toaster } from "@/components/ui/toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthenticated>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <Toaster richColors={true} />
    </ConvexAuthenticated>
  );
}
