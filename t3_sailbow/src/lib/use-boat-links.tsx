"use client";
import { useTrip, useGlobalActiveTrip } from "@/lib/use-trip";
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
    href: `/trips/${tripId}`,
  },
  {
    title: "Crew",
    icon: UsersRound,
    href: `/trips/${tripId}/crew`,
  },
  {
    title: "Itinerary",
    icon: ListChecks,
    href: `/trips/${tripId}/itinerary`,
  },
  {
    title: "Announcements",
    icon: Megaphone,
    href: `/trips/${tripId}/announcements`,
  },
  {
    title: "Settings",
    icon: Settings,
    href: `/trips/${tripId}/settings`,
  },
];
export const useTripLinks = () => {
  const { trip } = useGlobalActiveTrip();
  if (!trip) return;

  return getLinks(trip._id);
};

export const useRequiredTripLinks = () => {
  const { _id } = useTrip();
  return getLinks(_id);
};
