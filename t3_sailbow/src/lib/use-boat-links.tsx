"use client";
import { useBoat, useGlobalActiveBoat } from "@/hooks/use-boat";
import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";

const getLinks = (tripId: string) => [
  {
    title: "Overview",
    icon: Home,
    href: `/dock/${tripId}`,
  },
  {
    title: "Crew",
    icon: UsersRound,
    href: `/dock/${tripId}/crew`,
  },
  {
    title: "Itinerary",
    icon: ListChecks,
    href: `/dock/${tripId}/itinerary`,
  },
  {
    title: "Announcements",
    icon: Megaphone,
    href: `/dock/${tripId}/announcements`,
  },
  {
    title: "Settings",
    icon: Settings,
    href: `/dock/${tripId}/settings`,
  },
];
export const useTripLinks = () => {
  const { boat } = useGlobalActiveBoat();
  if (!boat) return;

  return getLinks(boat._id);
};

export const useRequiredTripLinks = () => {
  const { _id } = useBoat();
  return getLinks(_id);
};
