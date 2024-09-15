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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TripOverviewPage() {
  const { data: trip } = useTrip();
  const { data: me } = useMe();
  if (!trip || !me) return;
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        {/* <BoatPageTitle>Welcome, {me.firstName}!</BoatPageTitle> */}
        <BoatPageTitle>{trip.name}</BoatPageTitle>
        {!trip.banner && (
          <div className="ml-auto">
            <TripBannerModal />
          </div>
        )}
      </BoatPageHeader>
      <BoatPageContent>
        {/* <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4">
            <Card>
              <CardHeader className="border-b p-2">
                <CardTitle className="text-sm font-light">Trip name</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-base font-semibold">{trip.name}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal">Crew members</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div> */}
        <HomePageContent />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
