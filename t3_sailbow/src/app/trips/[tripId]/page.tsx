"use client";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../trip-page-components";
import HomePageContent from "./home-page-content";
import TripBannerModal from "./trip-banner-modal";
import { useTrip } from "@/lib/use-trip";

export default function Page() {
  const { _id, name, banner } = useTrip();
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>{name}</BoatPageTitle>
        {!banner && (
          <div className="ml-auto">
            <TripBannerModal tripId={_id} />
          </div>
        )}
      </BoatPageHeader>
      <BoatPageContent>
        <HomePageContent />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
