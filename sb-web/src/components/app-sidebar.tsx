import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Anchor } from "lucide-react";
import { UserDropdown } from "@/app/_components/user-dropdown";
import NotificationsDropdown from "@/app/_components/notifications";
import ImageWithLoader from "@/app/_components/image-with-loader";
import ActiveTripSidebarGroup from "./active-trip-sidebar-group";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex h-12 w-full items-center gap-4 p-2">
          <div className="flex aspect-square size-8 items-center justify-center">
            <ImageWithLoader src="/icon.svg" alt="Sailbow Logo" />
          </div>
          <span className="font-semibold">sailbow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ActiveTripSidebarGroup />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/trips">
                  <SidebarMenuButton>
                    <Anchor className="mr-2 h-4 w-4" />
                    Trips
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NotificationsDropdown />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
