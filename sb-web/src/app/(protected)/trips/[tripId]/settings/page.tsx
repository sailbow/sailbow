"use client";

import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../trip-page-components";
import DeleteTripCard from "./delete-trip-card";
import UpdateNameCard from "./update-name-card";

export default function SettingsPage() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Settings</TripPageTitle>
      </TripPageHeader>
      <TripPageContent>
        <div className="flex flex-col space-y-4">
          <UpdateNameCard />
          <DeleteTripCard />
        </div>
      </TripPageContent>
    </TripPageContainer>
  );
}
