import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuItemWithDismiss,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Anchor } from "lucide-react";
import { UserDropdown } from "@/app/_components/user-dropdown";
import NotificationsDropdown from "@/app/_components/notifications";
import ActiveTripSidebarGroup from "./active-trip-sidebar-group";
import SidebarTriggerButton from "./sidebar-trigger-button";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4 pl-2 pt-2">
            <Image width={24} height={24} src="/icon.svg" alt="Sailbow Logo" />
            <div className="font-semibold">sailbow</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ActiveTripSidebarGroup />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItemWithDismiss>
                <Link href="/trips">
                  <SidebarMenuButton>
                    <Anchor className="mr-2 h-4 w-4" />
                    Trips
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItemWithDismiss>
              <SidebarMenuItem>
                <NotificationsDropdown />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
          <SidebarTriggerButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
