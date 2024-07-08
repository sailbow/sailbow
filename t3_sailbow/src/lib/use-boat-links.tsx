"use client";
import { useBoat, useGlobalActiveBoat } from "@/hooks/use-boat";
import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";

const getLinks = (boatId: number) => [
  {
    title: "Overview",
    icon: Home,
    href: `/dock/${boatId}`,
  },
  {
    title: "Itinerary",

    icon: ListChecks,
    href: `/dock/${boatId}/itinerary`,
  },
  {
    title: "Crew",
    icon: UsersRound,
    href: `/dock/${boatId}/crew`,
  },
  {
    title: "Announcements",
    icon: Megaphone,
    href: `/dock/${boatId}/announcements`,
  },
  {
    title: "Settings",
    icon: Settings,
    href: `/dock/${boatId}/settings`,
  },
];
export const useBoatLinks = () => {
  const { boat } = useGlobalActiveBoat();
  if (!boat) return;

  return getLinks(boat.id);
};

export const useRequiredBoatLinks = () => {
  const { id } = useBoat();
  return getLinks(id);
};
