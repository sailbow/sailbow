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
          <div className="flex w-full max-w-4xl flex-col gap-4">
            {!trip.location && <SetLocationBadge />}
            {!trip.dates && <SetDateRangeBadge />}
            {trip.location && <LocationCard trip={trip} />}
            {trip.dates && <DateCard dates={trip.dates} />}
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
      <Card className="flex-1">
        <CardHeader className="items-start">
          <div className="flex w-full">
            <div className="flex size-10 items-center justify-center rounded-full bg-background p-2">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="ml-2 flex flex-col items-start space-y-1.5">
              <CardTitle>{location.primaryText}</CardTitle>
              {location.secondaryText && (
                <CardDescription className="pl-0.5">
                  {location.secondaryText}
                </CardDescription>
              )}
            </div>
            <Button
              className="ml-auto"
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
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.geo ? `${location.geo.lat}%2C${location.geo.lng}` : location.primaryText}&destination_place_id=${location.placeId}`}
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                  className: "underline-offset-2 hover:underline",
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
                    variant: "outline",
                    className: "underline-offset-2 hover:underline",
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
      <Card>
        <CardHeader>
          <div className="flex w-full items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-background p-2">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <CardTitle className="text-wrap text-left">
              {formatDateRange(new Date(dates.start), new Date(dates.end))}
            </CardTitle>
            <Button
              className="ml-auto"
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
        className="gap-5 rounded-sm bg-cyan-700 py-2 text-lg text-white hover:bg-cyan-700 dark:bg-cyan-950 hover:dark:bg-cyan-950"
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
      className="gap-5 rounded-sm bg-cyan-700 py-2 text-lg text-white hover:bg-cyan-700 dark:bg-cyan-950 hover:dark:bg-cyan-950"
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
