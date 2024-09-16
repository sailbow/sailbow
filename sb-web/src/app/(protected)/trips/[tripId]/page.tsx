"use client";
import { useActiveTripId, useCrewCount, useTrip } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../trip-page-components";
import TripDetails from "./trip-details";
import TripBannerModal from "./trip-banner-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ListChecks,
  Megaphone,
  Settings,
  User2,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripOverviewPage() {
  const activeTripId = useActiveTripId();
  const { data: trip } = useTrip();
  const { data: crewCount } = useCrewCount(activeTripId);
  if (!trip) return;
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>{trip.name}</TripPageTitle>
      </TripPageHeader>
      <Tabs
        defaultValue="overview"
        className="relative flex size-full max-w-4xl flex-col space-y-2 overflow-auto"
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="w-full pt-2">
          <div className="grid grid-cols-4 gap-4">
            <Card className="col-span-4 lg:col-span-2">
              <CardHeader className="border-b p-4">
                <CardTitle className="text-2xl font-normal">General</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TripBannerModal />
                  <Link
                    href={`/trips/${trip._id}/settings`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <Settings className="mr-2 size-5" />
                    Other settings
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-2">
              <CardHeader className="border-b p-4">
                <CardTitle className="text-2xl">Crew</CardTitle>
              </CardHeader>
              <CardContent className="flex w-full items-center justify-between p-4">
                <div className="flex w-full items-center gap-2">
                  {!crewCount ? (
                    <Skeleton className="h-8 flex-1" />
                  ) : (
                    <Link
                      href={`/trips/${trip._id}/crew`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Users2 className="mr-2 size-5" />
                      Members: {crewCount.count}
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader className="border-b p-4">
                <CardTitle className="text-2xl">Planning</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/trips/${trip._id}/itinerary`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <ListChecks className="mr-2 size-5" />
                    Itinerary
                  </Link>
                  <Link
                    href={`/trips/${trip._id}/announcements`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <Megaphone className="mr-2 size-5" />
                    Announcements
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details" className="relative mt-0 size-full pt-2">
          <TripDetails />
        </TabsContent>
      </Tabs>
    </TripPageContainer>
  );
}
