"use client";

import TripSearch from "@/app/_components/trip-search";
import { useTripLinks } from "@/lib/use-trip-links";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./ui/sidebar";
import { useActiveTrip } from "@/lib/trip-queries";
import Link from "next/link";

const ActiveTripGroup = () => {
  const links = useTripLinks();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Current Trip</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <TripSearch />
          <SidebarMenuSub>
            {links.map((l, i) => (
              <SidebarMenuSubItem key={i}>
                <Link href={l.href}>
                  <SidebarMenuSubButton isActive={pathname === l.href}>
                    <l.icon className="mr-2 h-4 w-4" />
                    {l.title}
                  </SidebarMenuSubButton>
                </Link>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const ActiveTripSidebarGroup = () => {
  const { data: trip } = useActiveTrip();
  if (!trip) return;
  return <ActiveTripGroup />;
};

export default ActiveTripSidebarGroup;
