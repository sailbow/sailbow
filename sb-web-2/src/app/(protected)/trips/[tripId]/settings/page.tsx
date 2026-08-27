"use client";

import { useActiveTrip } from "@/lib/trip-queries";
import TripBannerModal from "../_components/trip-banner-modal";
import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../_components/trip-page-components";
import DeleteTripCard from "./delete-trip-card";
import UpdateNameCard from "./update-name-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BannerModal from "@/app/_components/banner-modal";

export default function SettingsPage() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Settings</TripPageTitle>
      </TripPageHeader>
      <TripPageContent>
        <div className="flex flex-col space-y-4">
          <UpdateNameCard />
          <EditCoverPhotoCard />
          <DeleteTripCard />
        </div>
      </TripPageContent>
    </TripPageContainer>
  );
}

const EditCoverPhotoCard = () => {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <TripBannerModal />
      </CardContent>
    </Card>
  );
};
