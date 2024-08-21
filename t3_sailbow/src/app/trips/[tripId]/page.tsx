"use client";
import { useTrip } from "@/lib/trip-queries";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../trip-page-components";
import HomePageContent from "./home-page-content";
import TripBannerModal from "./trip-banner-modal";

export default function TripOverviewPage() {
  const { data: trip } = useTrip();
  if (!trip) return;
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>{trip.name}</BoatPageTitle>
        {!trip.banner && (
          <div className="ml-auto">
            <TripBannerModal />
          </div>
        )}
      </BoatPageHeader>
      <BoatPageContent>
        <HomePageContent />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
