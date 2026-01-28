"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActiveTrip,
  useActiveTripId,
  useCrew,
  usePendingAndDeclinedInvites,
} from "@/lib/trip-queries";
import InviteButton from "../crew/invite-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageWithLoader from "@/app/_components/image-with-loader";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CalendarIcon,
  ChevronDown,
  CornerUpRight,
  DollarSign,
  Edit2,
  ExternalLink,
  Globe,
  Image,
  ImageIcon,
  MapPin,
} from "lucide-react";
import { useGooglePlace } from "@/hooks/google-places";
import { useDisclosure } from "@/lib/use-disclosure";
import { cn } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
// import { GooglePlaceSearchDialog } from "@/components/google-places";
import { GoogleLocationSearch } from "@/components/google-location-search";
import { toast } from "@/components/ui/toast";
import PhotoCarouselDialog from "@/components/photo-carousel";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import LoadingButton from "@/components/loading-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DollarInput from "@/components/dollar-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/lib/use-debounce";
import {
  RD,
  RDContent,
  RDDescription,
  RDFooter,
  RDHeader,
  RDTitle,
  RDTrigger,
} from "@/components/ui/responsive-dialog";
import { DtDialog } from "@/components/dt-dialog";
import ResponsiveCalendarDisclosure from "@/components/ui/calendar/responsive-calendar";
import { formatDateRange } from "little-date";

export const CaptainTile = ({ className }: { className?: string }) => {
  const { data: crew, isPending: isCrewLoading } = useCrew();
  const captain = crew?.find((c) => c.role === "captain");
  const isLoading = isCrewLoading;
  return (
    <Card className={className}>
      <div className="flex items-center space-x-4 p-4">
        <div className="flex-shrink-0">
          <Avatar className="size-14 lg:size-20">
            {isLoading ? (
              <Skeleton className="size-full rounded-full dark:bg-slate-500" />
            ) : (
              <AvatarImage src={captain?.imageUrl} />
            )}
          </Avatar>
        </div>
        <div className="flex flex-1 flex-col space-y-1.5">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-sm dark:bg-slate-500" />
          ) : (
            <>
              <CardTitle className="text-lg @lg:text-2xl">
                {`${captain?.firstName ?? ""} ${captain?.lastName ?? ""}`}
              </CardTitle>
              <CardDescription>Captain</CardDescription>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export const CrewTile = ({ className }: { className?: string }) => {
  const { data: crew, isPending: isCrewLoading } = useCrew();
  const { data: invites, isLoading: areInvitesLoading } =
    usePendingAndDeclinedInvites();

  // const isLoading = true;
  const isLoading = isCrewLoading || areInvitesLoading;

  if (isLoading || !crew || !invites)
    return (
      <Card className={cn("overflow-hidden", className)}>
        <Skeleton className="size-full dark:bg-slate-500" />
      </Card>
    );

  const going = crew.length;
  const invited = going - 1 + invites.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex gap-2">
          <div className="flex flex-wrap items-center gap-1 *:text-nowrap">
            <CardTitle className="text-2xl">Crew</CardTitle>
            <CardDescription>
              ({going} going, {invited} invited)
            </CardDescription>
          </div>

          <div className="ml-auto">
            <InviteButton size="sm" variant="outline" />
          </div>
        </div>
        <div className="relative">
          <AvatarGroup users={crew} />
        </div>
      </CardHeader>
    </Card>
  );
};

export const LocationTile = ({ className }: { className?: string }) => {
  const { data: trip, isPending: isTripLoading } = useActiveTrip();

  const { data: googlePlace, isLoading: isGooglePlaceLoading } = useGooglePlace(
    trip?.location?.placeId,
  );

  const editDisclosure = useDisclosure();
  const viewGalleryDisclosure = useDisclosure();

  const isLoading = isTripLoading || isGooglePlaceLoading;
  if (isLoading || isGooglePlaceLoading || !trip)
    return (
      <Card
        className={cn("size-full min-h-[300px] overflow-hidden", className)}
      >
        <Skeleton className="size-full dark:bg-slate-500" />
      </Card>
    );

  const photoUrl = googlePlace?.photos?.[0]?.getUrl();

  const photos =
    googlePlace?.photos?.map((p) => ({
      src: p.getUrl(),
    })) ?? [];

  if (trip.location) {
    return (
      <>
        <Card
          className={cn(
            "flex size-full flex-col border border-input relative",
            photoUrl && "min-h-[300px]",
            className,
          )}
        >
          {photoUrl && (
            <div className="relative flex min-h-[150px]">
              <ImageWithLoader
                src={photoUrl}
                alt=""
                className="rounded-b-none data-[loaded='true']:dark:bg-slate-500"
              />
            </div>
          )}
          <CardHeader className={cn("flex flex-1 p-0 pl-4 pr-8 py-2", photoUrl && "justify-center")}>
            <div className="flex w-full gap-2">
              <CardTitle className="flex items-center gap-2 text-lg @xl:text-xl">
              {trip.location.primaryText}
            </CardTitle>
                            <Button
                className="ml-auto shrink-0 z-10 opacity-85 backdrop-blur-lg"
                variant="outline"
                size="icon"
                onClick={() => editDisclosure.setOpened()}
              >
                <Edit2 className="size-4" />
              </Button>
            </div>
            
            {trip.location.secondaryText !== trip.location.primaryText && (
              <CardDescription>{trip.location.secondaryText}</CardDescription>
            )}  
            <div className="flex flex-wrap gap-1 pt-1">
              {trip.location?.website && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={trip.location.website}
                  className={buttonVariants({
                    size: "sm",
                    variant: "outline",
                    className:
                      "h-fit px-3 py-2 text-xs underline-offset-2 hover:underline",
                  })}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden @xl:block">Website</span>
                </Link>
              )}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${trip.location.geo ? `${trip.location.geo.lat}%2C${trip.location.geo.lng}` : trip.location.primaryText}&destination_place_id=${trip.location.placeId}`}
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                  className:
                    "h-fit px-3 py-2 text-xs underline-offset-2 hover:underline",
                })}
              >
                <CornerUpRight className="h-4 w-4" />
                <span className="hidden @xl:block">Directions</span>
              </Link>
              {photos.length > 0 && (
                <Button
                  variant="outline"
                  className="h-fit px-3 py-2 text-xs"
                  onClick={() => viewGalleryDisclosure.setOpened()}
                >
                  <ImageIcon />
                  <span className="hidden @xl:block">Gallery</span>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
        <SetLocationDialog {...editDisclosure} defaultPlace={trip.location} />
        <PhotoCarouselDialog photos={photos} {...viewGalleryDisclosure} />
      </>
    );
  }

  return (
    <>
      <Button
        className="flex size-full flex-col items-center justify-center gap-4 bg-card text-base [&_svg]:size-8 md:[&_svg]:size-12"
        variant="outline"
        onClick={() => editDisclosure.setOpened()}
      >
        <MapPin className="size-12" />
        <div>
          {" "}
          No location set{" "}
          <span className="text-muted-foreground">(click to edit)</span>
        </div>
      </Button>
      <SetLocationDialog {...editDisclosure} defaultPlace={trip.location} />
    </>
  );
};

export const DatesTile = ({ className }: { className?: string }) => {
  const { data: trip, isPending: isTripLoading } = useActiveTrip();
  const editDisclosure = useDisclosure();

  if (isTripLoading || !trip)
    return (
      <Card className={cn("size-full overflow-hidden", className)}>
        <Skeleton className="size-full dark:bg-slate-500" />
      </Card>
    );

  if (!trip.dates) {
    return (
      <>
        <SetDateRangeDialog
          {...editDisclosure}
          trigger={
            <Button
              className="flex size-full flex-col items-center justify-center gap-4 bg-card text-base [&_svg]:size-8 md:[&_svg]:size-12"
              variant="outline"
              onClick={() => editDisclosure.setOpened()}
            >
              <CalendarIcon />
              <div>
                {" "}
                No date set{" "}
                <span className="text-muted-foreground">(click to edit)</span>
              </div>
            </Button>
          }
          defaultValue={trip.dates}
        />
      </>
    );
  }

  return (
    <SetDateRangeDialog
      {...editDisclosure}
      defaultValue={
        trip.dates && {
          from: new Date(trip.dates.start),
          to: new Date(trip.dates.end),
        }
      }
      trigger={
        <Button
          className="flex size-full items-center justify-center gap-4 bg-card p-4"
          variant="outline"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-4xl font-bold">
              {format(trip.dates.start, "M/d")}
            </div>
            <div className="text-2xl text-muted-foreground">
              {format(trip.dates.start, "EEE")}
            </div>
          </div>
          {trip.dates.end && trip.dates.end !== trip.dates.start && (
            <>
              <div className="text-4xl font-bold">{"-"}</div>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-4xl font-bold tracking-wide">
                  {format(trip.dates.end, "M/d")}
                </div>
                <div className="text-2xl text-muted-foreground">
                  {format(trip.dates.end, "EEE")}
                </div>
              </div>
            </>
          )}
        </Button>
      }
    />
  );
};

export const BudgetTile = ({ className }: { className?: string }) => {
  const { data: trip, isPending: isTripLoading } = useActiveTrip();
  const editDisclosure = useDisclosure();

  if (isTripLoading || !trip)
    return (
      <Card className={cn("size-full overflow-hidden", className)}>
        <Skeleton className="size-full dark:bg-slate-500" />
      </Card>
    );

  if (!trip.budget) {
    return (
      <>
        <Button
          className="flex size-full flex-col items-center justify-center gap-4 bg-card text-base [&_svg]:size-8 md:[&_svg]:size-12"
          variant="outline"
          onClick={() => editDisclosure.setOpened()}
        >
          <DollarSign />
          <div>
            {" "}
            No budget set{" "}
            <span className="text-muted-foreground">(click to edit)</span>
          </div>
        </Button>
        <SetBudgetDialog {...editDisclosure} />
      </>
    );
  }

  return (
    <>
      <Button
        className="flex size-full flex-col items-center justify-center gap-4 bg-card [&_svg]:size-8 md:[&_svg]:size-12"
        variant="outline"
        onClick={() => editDisclosure.setOpened()}
      >
        <div className="text-xl font-bold text-green-600 @xl:text-4xl">
          ${trip.budget.low}
          {trip.budget.high ? ` - $${trip.budget.high}` : ""}
        </div>
        <div className="text-lg text-muted-foreground @xl:text-2xl">Budget</div>
      </Button>
      <SetBudgetDialog {...editDisclosure} defaultBudget={trip.budget} />
    </>
  );
};

const SetDateRangeDialog = ({
  open,
  onOpenChange,
  defaultValue,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
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
    setIsSaving(true);
    mutate({
      tripId,
      dates: !dates?.from
        ? undefined
        : {
            start: dates.from.getTime(),
            end: dates.to?.getTime() ?? dates.from.getTime(),
          },
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
    <RD open={open} onOpenChange={onOpenChange}>
      <RDTrigger asChild>{trigger}</RDTrigger>
      <RDContent
        className={cn("w-auto min-w-[60vw]", !isMobile && "bg-background")}
      >
        <RDHeader className="text-center">
          <RDTitle className="min-h-4 w-full text-center">
            {dates?.from &&
              formatDateRange(dates.from, dates.to ?? dates.from, {
                includeTime: false,
              })}
          </RDTitle>
        </RDHeader>
        <Calendar
          className={
            isMobile
              ? "[--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
              : "mx-auto bg-background"
          }
          required
          showOutsideDays={isMobile}
          numberOfMonths={isMobile ? 1 : 2}
          mode="range"
          selected={dates}
          defaultMonth={defaultValue?.from}
          onSelect={(range) => {
            setDates({
              from: range?.from,
              to: range?.to,
            });
          }}
        ></Calendar>
        <RDFooter className="justify-center">
          <Button
            variant="secondary"
            onClick={() => setDates({ from: undefined, to: undefined })}
          >
            Reset
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <LoadingButton onClick={handleSave} isLoading={isSaving}>
            Save
          </LoadingButton>
        </RDFooter>
      </RDContent>
    </RD>
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

  const [selected, setSelected] = useState(defaultPlace);

  return (
    <RD open={open} onOpenChange={onOpenChange}>
      <RDContent>
        <RDHeader>
          <RDTitle>{defaultPlace ? "Update" : "Set"} location</RDTitle>
          {defaultPlace && (
            <div className="w-full">
              <RDDescription>
               {defaultPlace.primaryText}
              </RDDescription>
              {defaultPlace.secondaryText && defaultPlace.primaryText !== defaultPlace.secondaryText && <RDDescription>{defaultPlace.secondaryText}</RDDescription>}
            </div>
          )}
        </RDHeader>
        <div className="flex w-full max-xs:h-[25dvh]">
<GoogleLocationSearch onSelect={setSelected}  />
        </div>
        
        <RDFooter>
          <Button
            disabled={isSaving}
            variant="outline"
            onClick={() => {
              setSelected(undefined);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={isSaving}
            onClick={() => {
              setIsSaving(true);
              mutate({ tripId, location: selected })
                .then(() => {
                  setIsSaving(false)
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
          >
            Save
          </LoadingButton>
        </RDFooter>
      </RDContent>
    </RD>
  );
};

const BudgetSchema = z
  .object({
    low: z.coerce.number().nullable(),
    high: z.coerce.number().nullable(),
  })
  .transform((args) => ({
    low: args.low === 0 ? null : args.low,
    high: args.high === 0 ? null : args.high,
  }))
  .superRefine(({ low, high }, ctx) => {
    if (low && high && low > high) {
      ctx.addIssue({
        path: ["high"],
        code: "custom",
        message: "Max cannot be lower than min",
      });
    }
  });

const SetBudgetDialog = ({
  open,
  onOpenChange,
  defaultBudget,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBudget?: { low: number; high?: number };
}) => {
  const tripId = useActiveTripId();

  const [isLoading, setIsLoading] = useState(false);
  const mutate = useMutation(
    api.trips.mutations.updateBudget,
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.trips.queries.getById, { tripId });
    if (current) {
      localStore.setQuery(
        api.trips.queries.getById,
        { tripId },
        { ...current, budget: args.budget },
      );
    }
  });

  const form = useForm({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      low: defaultBudget?.low ?? null,
      high: defaultBudget?.high ?? null,
    },
  });

  useEffect(() => {
    form.reset({
      low: defaultBudget?.low ?? null,
      high: defaultBudget?.high ?? null,
    });
  }, [open, form, defaultBudget]);

  const handleSave = (budget: z.infer<typeof BudgetSchema>) => {
    setIsLoading(true);
    mutate({
      tripId,
      budget: budget.low
        ? { low: budget.low, high: budget.high ?? undefined }
        : undefined,
    })
      .then(() => {
        onOpenChange(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong there");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <RD open={open} onOpenChange={onOpenChange}>
      <RDContent>
        <RDHeader>
          <RDTitle>Set a budget</RDTitle>
        </RDHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="flex flex-col space-y-4"
            autoFocus={false}
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="low"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Min</FormLabel>
                      <FormControl>
                        <DollarInput {...field} value={field.value ?? ""} />
                      </FormControl>
                      <div className="min-h-6">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="high"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>
                        Max{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <DollarInput {...field} value={field.value ?? ""} />
                      </FormControl>
                      <div className="min-h-6">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="mt-auto flex justify-end gap-4 pt-2">
              <Button
                variant="outline"
                className="w-20"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={isLoading}
                type="submit"
                className="w-20"
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </RDContent>
    </RD>
  );
};
const AvatarGroup = ({
  users,
}: {
  users: Array<{ firstName: string; lastName: string; imageUrl: string }>;
}) => {
  const [hovered, setHovered] = useState<number | undefined>();
  const debouncedHover = useDebounce(hovered, 100);
  return (
    <div className="relative flex items-center -space-x-2">
      {users.slice(0, 7).map((user, index) => {
        return (
          <Popover open={debouncedHover === index} key={index}>
            <PopoverTrigger asChild>
              <Avatar
                key={index}
                className={`z-${index} cursor-pointer bg-card ring-2 ring-background transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:ring-ring`}
                onMouseOver={() => setHovered(index)}
                onMouseLeave={() => setHovered(undefined)}
              >
                <AvatarImage
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>{user.firstName}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="w-fit text-sm ring-1 ring-border"
            >
              {`${user.firstName} ${user.lastName}`}
            </PopoverContent>
          </Popover>
        );
      })}
      {users.length > 7 && (
        <Avatar className="z-20 text-sm font-medium text-muted-foreground ring-2 ring-background">
          <AvatarFallback>
            +{users.slice(7).reduce((acc) => acc + 1, 0)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
