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
import { useMe } from "@/lib/user-queries";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function TripOverviewPage() {
  const { data: trip } = useTrip();
  const { data: me } = useMe();
  if (!trip || !me) return;
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Welcome, {me.firstName}!</BoatPageTitle>
        {!trip.banner && (
          <div className="ml-auto">
            <TripBannerModal />
          </div>
        )}
      </BoatPageHeader>
      <BoatPageContent>
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <Card>
              <CardHeader>
                {/* <div className="text-xs font-light">Trip name</div> */}
                <CardTitle className="text-center font-normal">
                  Trip {trip.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
        <HomePageContent />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
