"use client";

import TripSearch from "@/app/_components/trip-search";
import { useTripLinks } from "@/lib/use-trip-links";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import { useActiveTrip } from "@/lib/trip-queries";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const ActiveTripGroup = () => {
  const links = useTripLinks();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  return (
    <>
      <SidebarGroup>
        {/* <SidebarGroupLabel>Current Trip</SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu>
            <TripSearch />
            <SidebarMenuSub>
              {links.map((l, i) => (
                <SidebarMenuSubItem
                  className="hover:cursor-pointer"
                  key={i}
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar();
                    }
                    router.push(l.href);
                  }}
                >
                  <SidebarMenuSubButton isActive={pathname === l.href}>
                    <l.icon className="mr-2 h-4 w-4" />
                    {l.title}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator />
    </>
  );
};

const ActiveTripSidebarGroup = () => {
  const { data: trip } = useActiveTrip();
  if (!trip) return;
  return <ActiveTripGroup />;
};

export default ActiveTripSidebarGroup;
