"use client";
import { useCrewCount, useTrip } from "@/lib/trip-queries";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../trip-page-components";
import TripDetails from "./trip-details";
import TripBannerModal from "./trip-banner-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, User2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripOverviewPage() {
  const { data: trip } = useTrip();
  const { data: crewCount, isLoading: isLoadingCrewCount } = useCrewCount();
  if (!trip) return;
  return (
    <BoatPageContainer>
      <Tabs
        defaultValue="home"
        className="relativ flex size-full flex-col space-y-2 overflow-auto"
      >
        <BoatPageHeader>
          <BoatPageTitle>{trip.name}</BoatPageTitle>
        </BoatPageHeader>
        <BoatPageContent>
          <TabsList className="grid flex-1 grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="w-full pt-2">
            <div className="grid w-full grid-cols-1 gap-4">
              <div className="grid w-full gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="border-b p-4">
                    <CardTitle className="text-2xl font-normal">
                      General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <TripBannerModal />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="border-b p-4">
                    <CardTitle className="text-2xl">Crew</CardTitle>
                  </CardHeader>
                  <CardContent className="flex w-full items-center justify-between p-4">
                    <div className="flex w-full items-center">
                      <User2 className="mr-1 size-6" />
                      {!crewCount ? (
                        <Skeleton className="h-8 flex-1" />
                      ) : (
                        <div className="font-medium">
                          Members: {crewCount.count}
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <Link
                        href={`/trips/${trip._id}/crew`}
                        className={buttonVariants({
                          variant: "outline",
                        })}
                      >
                        View
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="relative mt-0 size-full pt-2">
            <TripDetails />
          </TabsContent>
        </BoatPageContent>
      </Tabs>
    </BoatPageContainer>
  );
}
