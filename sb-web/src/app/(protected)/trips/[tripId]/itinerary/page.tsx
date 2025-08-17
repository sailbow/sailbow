"use client";
import { useActiveTripId } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../_components/trip-page-components";
// import { ItinItemList } from "./itin-item-list";
import NewItinItemButton from "./new-itin-item-button";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Itinerary } from "./itin-v2";
import CenteredSpinner from "@/app/_components/centered-spinner";
import { useQueryWithStatus } from "@/lib/convex-client-helpers";
import { Card } from "@/components/ui/card";

export default function Page() {
  const tripId = useActiveTripId();
  const { data: itinerary, isPending } = useQueryWithStatus(
    api.itinerary.v2.list,
    { tripId },
  );
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Itinerary</TripPageTitle>
        <div className="ml-auto">
          <NewItinItemButton />
        </div>
      </TripPageHeader>
      <TripPageContent>
        {isPending && <CenteredSpinner />}
        {!isPending &&
          itinerary &&
          (itinerary.length > 0 ? (
            <Itinerary items={itinerary} />
          ) : (
            <Card className="container mx-4 flex flex-col items-center justify-center gap-4 py-8 xs:mx-auto">
              <h3 className="text-2xl leading-none tracking-tight text-card-foreground/80">
                No itinerary items have been added!
              </h3>
              <NewItinItemButton />
            </Card>
          ))}
      </TripPageContent>
    </TripPageContainer>
  );
}
