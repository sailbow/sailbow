"use client";
import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";
import { useActiveTripId } from "./trip-queries";

export const useTripLinks = () => {
  const tripId = useActiveTripId();
  return [
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
};
