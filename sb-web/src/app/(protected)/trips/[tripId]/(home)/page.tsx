"use client";
import { useActiveTrip, useActiveTripId } from "@/lib/trip-queries";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../_components/trip-page-components";
import TripDetails from "./trip-details";
import TripBannerModal from "../_components/trip-banner-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CalendarIcon,
  CornerUpRight,
  Edit,
  ExternalLink,
  Globe,
  ListChecks,
  MapPin,
  Megaphone,
  NotepadText,
  Settings,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CoolTabs } from "@/components/ui/cool-tabs";
import { CreateTripPollDialog } from "./create-trip-poll-dialog";
import { TripPolls } from "./trip-polls";
import { useQueryState } from "nuqs";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { isEqual as dateIsEqual, format as formatDate } from "date-fns";
import { Doc } from "@convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GooglePlaceSearchDialog,
  GooglePlaceSearchPopover,
} from "@/components/google-places";
import { useDisclosure } from "@/lib/use-disclosure";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "@/components/ui/toast";
import { CalendarDialog } from "@/components/ui/calendar-dialog";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingButton from "@/components/loading-button";
import { z } from "zod";
import { formatDateRange } from "@/lib/date-utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BudgetTile,
  CaptainTile,
  CrewTile,
  DatesTile,
  LocationTile,
} from "./components";

export default function TripOverviewPage() {
  const { data: trip } = useActiveTrip();

  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  if (!trip) return;

  return (
    <TripPageContainer>
      <TripPageHeader className="items-start pb-0">
        <div className="flex flex-col gap-3">
          <TripPageTitle>{trip.name}</TripPageTitle>
          <CoolTabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "polls", label: "Polls" },
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
          <div className="@container min-h-[200%]">
            <div className="@lg:grid-cols-2 @lg:grid-rows-6 grid size-full gap-4 pb-4">
              <CaptainTile className="@lg:row-span-2 @lg:row-start-1 @lg:content-center col-start-1" />
              <CrewTile className="@lg:row-span-2 @lg:row-start-3 @lg:content-center" />
              <div className="@lg:col-start-2 @lg:row-span-2 @lg:row-start-1">
                <DatesTile className="size-full" />
              </div>
              <LocationTile className="@lg:row-span-4" />

              <div className="@lg:row-span-2 @lg:row-start-5">
                <BudgetTile className="@lg:row-span-2 @lg:row-start-5" />
              </div>
            </div>
            <div className="mt-4">
              <TripDetails />
            </div>
          </div>
        )}
        {activeTab === "polls" && <TripPolls />}
        {activeTab === "details" && <TripDetails />}
      </TripPageContent>
    </TripPageContainer>
  );
}

const LocationCard = ({ trip }: { trip: Doc<"trips"> }) => {
  const { location } = trip;
  const editLocationDisclosure = useDisclosure();

  if (!location) return;
  const hasContent = !!location.website;

  return (
    <>
      <Card className="bg-background text-foreground">
        <CardHeader className="items-start p-4">
          <div className="flex w-full items-start">
            <MapPin className="size-8 shrink-0 text-primary" />
            <div className="ml-2 flex flex-col items-start gap-1.5">
              <CardTitle className="text-lg xs:text-2xl">
                {location.primaryText}
              </CardTitle>
              {location.secondaryText && (
                <CardDescription className="pl-0.5">
                  {location.secondaryText}
                </CardDescription>
              )}
            </div>
            <Button
              className="ml-auto shrink-0"
              variant="ghost"
              size="icon"
              onClick={() => {
                editLocationDisclosure.setOpened();
              }}
            >
              <Edit />
            </Button>
          </div>
        </CardHeader>
        {hasContent && (
          <CardContent className="p-0 px-6 pb-4 pr-4 sm:px-12">
            <div className="flex flex-wrap gap-1">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.geo ? `${location.geo.lat}%2C${location.geo.lng}` : location.primaryText}&destination_place_id=${location.placeId}`}
                className={buttonVariants({
                  size: "sm",
                  variant: "secondary",
                  className:
                    "text-xs underline-offset-2 hover:underline sm:text-sm",
                })}
              >
                <CornerUpRight className="h-4 w-4" />
                Get Directions
              </Link>
              {location.website && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={location.website}
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                    className:
                      "text-xs underline-offset-2 hover:underline sm:text-sm",
                  })}
                >
                  <Globe className="h-4 w-4" />
                  Website
                </Link>
              )}
            </div>
          </CardContent>
        )}
      </Card>
      <SetLocationDialog {...editLocationDisclosure} />
    </>
  );
};

const DateCard = ({
  dates,
}: {
  dates: Exclude<Doc<"trips">["dates"], undefined>;
}) => {
  const disclosure = useDisclosure();
  return (
    <>
      <Card className="bg-background text-foreground">
        <CardHeader className="items-start p-4">
          <div className="flex w-full items-center">
            <CalendarIcon className="size-7 shrink-0 text-primary" />
            <div className="ml-2 flex flex-col items-start gap-1.5">
              <CardTitle className="text-nowrap text-left text-lg xs:text-2xl">
                {formatDateRange(new Date(dates.start), new Date(dates.end))}
              </CardTitle>
            </div>

            <Button
              className="ml-auto shrink-0"
              variant="ghost"
              size="icon"
              onClick={() => {
                disclosure.setOpened();
              }}
            >
              <Edit />
            </Button>
          </div>
        </CardHeader>
      </Card>
      <SetDateRangeDialog
        {...disclosure}
        defaultValue={{ from: new Date(dates.start), to: new Date(dates.end) }}
      />
    </>
  );
};

const SetLocationDialog = ({
  open,
  onOpenChange,
  defaultPlace,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlace?: Doc<"trips">["location"];
}) => {
  const tripId = useActiveTripId();
  const [isSaving, setIsSaving] = useState(false);

  const mutate = useMutation(
    api.trips.mutations.updateLocation,
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.trips.queries.getById, { tripId });
    if (current) {
      localStore.setQuery(
        api.trips.queries.getById,
        { tripId },
        { ...current, location: args.location },
      );
    }
  });

  return (
    <GooglePlaceSearchDialog
      open={open}
      onOpenChange={onOpenChange}
      isLoading={isSaving}
      defaultPlace={defaultPlace}
      onSave={(place) => {
        setIsSaving(true);
        mutate({ tripId, location: place })
          .then(() => {
            onOpenChange(false);
          })
          .catch((err) => {
            console.error(err);
            toast.error("Something went wrong there");
          })
          .finally(() => {
            setIsSaving(false);
          });
      }}
    />
  );
};

const SetDateRangeDialog = ({
  open,
  onOpenChange,
  defaultValue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue?: { from: Date | undefined; to: Date | undefined };
}) => {
  const tripId = useActiveTripId();
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  const [dates, setDates] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(defaultValue);
  const mutate = useMutation(
    api.trips.mutations.updateDates,
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.trips.queries.getById, { tripId });
    if (current) {
      localStore.setQuery(
        api.trips.queries.getById,
        { tripId },
        { ...current, dates: args.dates },
      );
    }
  });

  const handleSave = () => {
    if (!dates?.from || !dates?.to) {
      toast.warning("Must provide a start and end date", {
        position: "top-center",
      });
      return;
    }
    setIsSaving(true);
    mutate({
      tripId,
      dates: { start: dates.from.getTime(), end: dates.to.getTime() },
    })
      .then(() => {
        onOpenChange(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong there");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit">
        <DialogHeader className="w-full flex-row items-center justify-center">
          <DialogTitle className="min-h-5">
            {dates?.from && formatDateRange(dates.from, dates.to)}
          </DialogTitle>
        </DialogHeader>
        <Calendar
          numberOfMonths={isMobile ? 1 : 2}
          showOutsideDays={isMobile}
          mode="range"
          selected={dates}
          onSelect={(range) => {
            setDates({
              from: range?.from,
              to: range?.to,
            });
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isSaving}
              className="w-20"
              onClick={() => {
                setDates(defaultValue);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton
            className="w-20"
            onClick={() => handleSave()}
            isLoading={isSaving}
            disabled={!dates?.from || !dates?.to || isSaving}
          >
            Save
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SetLocationBadge = () => {
  const disclosure = useDisclosure();
  return (
    <>
      <Badge
        variant="secondary"
        className="gap-5 rounded-sm bg-cyan-700 py-2 text-white hover:bg-cyan-700 dark:bg-cyan-950 hover:dark:bg-cyan-950 xs:text-lg"
      >
        <AlertCircle />A location has not been specified
        <Button className="ml-auto w-32" onClick={() => disclosure.setOpened()}>
          Set a location
        </Button>
        <SetLocationDialog {...disclosure} />
      </Badge>
    </>
  );
};

const SetDateRangeBadge = () => {
  const disclosure = useDisclosure();
  return (
    <Badge
      variant="secondary"
      className="gap-5 rounded-sm bg-cyan-700 py-2 text-white hover:bg-cyan-700 dark:bg-cyan-950 hover:dark:bg-cyan-950 xs:text-lg"
    >
      <AlertCircle />
      Dates have not been selected
      <Button className="ml-auto w-32" onClick={() => disclosure.setOpened()}>
        Set dates
      </Button>
      <SetDateRangeDialog {...disclosure} />
    </Badge>
  );
};
