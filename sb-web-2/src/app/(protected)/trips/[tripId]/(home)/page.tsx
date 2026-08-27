"use client";
import { useActiveTrip } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../_components/trip-page-components";
import TripDetails from "./trip-details";
import { CoolTabs } from "@/components/ui/cool-tabs";
import { CreateTripPollDialog } from "./create-trip-poll-dialog";
import { TripPolls } from "./trip-polls";
import { useQueryState } from "nuqs";
import {
  BudgetTile,
  CaptainTile,
  CrewTile,
  DatesTile,
  LocationTile,
} from "./components";

export default function TripOverviewPage() {
  const { data: trip } = useActiveTrip();

  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  if (!trip) return;

  return (
    <TripPageContainer>
      <TripPageHeader className="items-start pb-0">
        <div className="flex flex-col gap-3">
          <TripPageTitle>{trip.name}</TripPageTitle>
          <CoolTabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "polls", label: "Polls" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <CreateTripPollDialog />
      </TripPageHeader>
      <TripPageContent>
        {activeTab === "overview" && (
          <div className="min-h-[200%] @container">
            <div className="grid size-full gap-4 pb-4 @lg:grid-cols-2 @lg:grid-rows-6">
              <CaptainTile className="col-start-1 @lg:row-span-2 @lg:row-start-1 @lg:content-center" />
              <CrewTile className="@lg:row-span-2 @lg:row-start-3 @lg:content-center" />
              <div className="@lg:col-start-2 @lg:row-span-2 @lg:row-start-1">
                <DatesTile className="size-full" />
              </div>
              <div className="@lg:row-span-4">
                <LocationTile className="size-full" />
              </div>

              <div className="@lg:row-span-2 @lg:row-start-5">
                <BudgetTile className="@lg:row-span-2 @lg:row-start-5" />
              </div>
            </div>
            <div className="mt-4">
              <TripDetails />
            </div>
          </div>
        )}
        {activeTab === "polls" && <TripPolls />}
        {activeTab === "details" && <TripDetails />}
      </TripPageContent>
    </TripPageContainer>
  );
}

