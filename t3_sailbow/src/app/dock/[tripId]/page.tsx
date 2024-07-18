"use client";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../boat-page-components";
import HomePageContent from "./home-page-content";
import TripBannerModal from "./trip-banner-modal";
import { useBoat } from "@/hooks/use-boat";

export default function Page() {
  const { _id, name, banner } = useBoat();
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
