"use client";
import { useActiveTrip } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../_components/trip-page-components";
import TripDetails from "./trip-details";
import TripBannerModal from "../_components/trip-banner-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Megaphone, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { CoolTabs } from "@/components/ui/cool-tabs";
import { useDisclosure } from "@/lib/use-disclosure";
import { CreateTripPollDialog } from "./create-trip-poll-dialog";

export default function TripOverviewPage() {
  const { data: trip } = useActiveTrip();

  const [activeTab, setActiveTab] = useState("overview");

  if (!trip) return;

  return (
    <TripPageContainer>
      <TripPageHeader className="items-start pb-0">
        <div className="flex flex-col gap-3">
          <TripPageTitle>{trip.name}</TripPageTitle>
          <CoolTabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "details", label: "Details" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <CreateTripPollDialog />
      </TripPageHeader>
      <TripPageContent>
        {activeTab === "overview" && (
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
                  <Link
                    href={`/trips/${trip._id}/crew`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <Users2 className="mr-2 size-5" />
                    Members: {trip.crewCount}
                  </Link>
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
        )}
        {activeTab === "details" && <TripDetails />}
        {/* <Tabs
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
                  <CardTitle className="text-2xl font-normal">
                    General
                  </CardTitle>
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
                    <Link
                      href={`/trips/${trip._id}/crew`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Users2 className="mr-2 size-5" />
                      Members: {trip.crewCount}
                    </Link>
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
        </Tabs> */}
      </TripPageContent>
    </TripPageContainer>
  );
}
