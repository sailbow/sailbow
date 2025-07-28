"use client";
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
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuItemWithDismiss,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link, { LinkProps } from "next/link";
import { Anchor } from "lucide-react";
import { UserDropdown } from "@/app/_components/user-dropdown";
import NotificationsDropdown from "@/app/_components/notifications";
import ActiveTripSidebarGroup from "./active-trip-sidebar-group";
import SidebarTriggerButton from "./sidebar-trigger-button";
import Image from "next/image";

const SidebarLinkWithDismiss = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>((props, ref) => {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <Link
      ref={ref}
      href={props.href}
      className={sidebarMenuButtonVariants()}
      onClick={() => {
        if (isMobile) {
          toggleSidebar();
        }
      }}
    >
      {props.children}
    </Link>
  );
});

SidebarLinkWithDismiss.displayName = "SidebarLinkWithDismiss";

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
              <SidebarLinkWithDismiss href="/trips">
                <Anchor className="mr-2 h-4 w-4" />
                Trips
              </SidebarLinkWithDismiss>
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
      <SidebarRail />
    </Sidebar>
  );
}
