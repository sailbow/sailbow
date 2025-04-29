"use client";
import { useActiveTripId } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../_components/trip-page-components";
import { ItinItemList } from "./itin-item-list";
import NewItinItemButton from "./new-itin-item-button";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Itinerary } from "./itin-v2";
import CenteredSpinner from "@/app/_components/centered-spinner";

export default function Page() {
  const tripId = useActiveTripId();
  const itinerary = useQuery(api.itinerary.v2.list, { tripId });
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Itinerary</TripPageTitle>
        <div className="ml-auto">
          <NewItinItemButton />
        </div>
      </TripPageHeader>
      <TripPageContent>
        {itinerary ? <Itinerary items={itinerary} /> : <CenteredSpinner />}
      </TripPageContent>
    </TripPageContainer>
  );
}
