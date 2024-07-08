"use client";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";

export const useBoatLinks = () => {
  const { boat } = useGlobalActiveBoat();
  if (!boat) return;

  return [
    {
      title: "Overview",
      icon: Home,
      href: `/dock/${boat.id}`,
    },
    {
      title: "Itinerary",

      icon: ListChecks,
      href: `/dock/${boat.id}/itinerary`,
    },
    {
      title: "Crew",
      icon: UsersRound,
      href: `/dock/${boat.id}/crew`,
    },
    {
      title: "Announcements",
      icon: Megaphone,
      href: `/dock/${boat.id}/announcements`,
    },
    {
      title: "Settings",
      icon: Settings,
      href: `/dock/${boat.id}/settings`,
    },
  ];
};
