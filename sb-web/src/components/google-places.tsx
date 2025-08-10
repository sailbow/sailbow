"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import { env } from "@/env";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getDetails,
  Suggestion,
} from "use-places-autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useDisclosure } from "@/lib/use-disclosure";
import { useEffect, useState } from "react";
import { Spinner } from "@/app/_components/spinner";
import { z } from "zod";
import { toast } from "./ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import LoadingButton from "./loading-button";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const GooglePlaceResultSchema = z.object({
  placeId: z.string(),
  primaryText: z.string(),
  secondaryText: z.string().optional(),
  website: z.string().optional(),
  photo: z.string().optional(),
  icon: z
    .object({
      url: z.string(),
      background: z.string(),
    })
    .optional(),
  geo: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export type GooglePlaceResult = z.infer<typeof GooglePlaceResultSchema>;

export const GooglePlaceSearchPopover = ({
  onSelect,
  trigger,
}: {
  onSelect: (place: GooglePlaceResult) => void;
  trigger: React.ReactElement;
}) => {
  const popoverDisclosure = useDisclosure();
  const isMobile = useIsMobile();
  const onSelectPlace = (place: GooglePlaceResult) => {
    onSelect(place);
    popoverDisclosure.setClosed();
  };

  return (
    <Popover {...popoverDisclosure}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-md p-0"
        align="start"
        avoidCollisions={isMobile}
      >
        <GooglePlaceSearch
          className="max-h-80 min-h-80"
          onSelect={onSelectPlace}
        />
      </PopoverContent>
    </Popover>
  );
};

export const GooglePlaceSearchDialog = ({
  onSave,
  open,
  onOpenChange,
  isLoading,
  defaultPlace,
}: {
  onSave: (place: GooglePlaceResult) => void;
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlace?: GooglePlaceResult;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[55dvh] max-h-[55-dvh]">
        <div className="relative size-full">
          {isLoading && <Spinner className="absolute right-2 top-2" />}
          <GooglePlaceSearch
            onSelect={(place) => {
              onSave(place);
            }}
            className="bg-card text-card-foreground"
            defaultPlace={defaultPlace}
            clearOnSelect={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

type GooglePlaceSearchProps = {
  onSelect: (place: GooglePlaceResult) => void;
  defaultPlace?: { primaryText: string; placeId: string };
  className?: string;
  clearOnSelect?: boolean;
};

const GooglePlaceSearch = ({
  onSelect,
  defaultPlace,
  clearOnSelect = true,
  className,
}: GooglePlaceSearchProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const {
    init,
    ready,
    setValue,
    value,
    suggestions: { status, data, loading },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const [fetchingPlaceId, setFetchingPlaceId] = useState<string | undefined>(
    undefined,
  );

  const [selectedPlace, setSelectedPlace] = useState<
    | {
        placeId: string;
        primaryText: string;
      }
    | undefined
  >(defaultPlace);

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  const onSelectSuggestion = (value: Suggestion) => {
    setFetchingPlaceId(value.place_id);
    getDetails({
      placeId: value.place_id,
      fields: [
        "website",
        "icon",
        "icon_background_color",
        "photos",
        "geometry",
        "formatted_address",
      ],
    })
      .then((details) => {
        if (typeof details !== "object")
          throw new Error("Cannot parse google places search result");
        const result: GooglePlaceResult = {
          placeId: value.place_id,
          primaryText: value.structured_formatting.main_text,
          secondaryText: details.formatted_address,
          website: details.website,
          photo: details.photos?.at(0)?.getUrl(),
          ...(details.icon &&
            details.icon_background_color && {
              icon: {
                url: details.icon,
                background: details.icon_background_color,
              },
            }),
          ...(details.geometry?.location && {
            geo: details.geometry.location.toJSON(),
          }),
        };
        onSelect(result);
        if (clearOnSelect) {
          setTimeout(clearSuggestions, 200);
        } else {
          setSelectedPlace(result);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong selecting a location");
      })
      .finally(() => {
        setFetchingPlaceId(undefined);
      });
  };

  if (!isLoaded || !ready) return <Spinner />;
  return (
    <Command className={cn("min-h-24", className)}>
      <CommandInput
        placeholder="e.g. Paris"
        disabled={!!fetchingPlaceId}
        onChangeCapture={(e) => setValue(e.currentTarget.value)}
        value={selectedPlace ? selectedPlace.primaryText : value}
      />
      <CommandList>
        {loading && <CenteredSpinner />}
        {!loading && !status && (
          <CommandEmpty className="text-muted-foreground">
            Search for a place to get started
          </CommandEmpty>
        )}
        {!loading && status === "ZERO_RESULTS" && (
          <CommandEmpty className="text-muted-foreground">
            No places found
          </CommandEmpty>
        )}
        {status === "OK" && (
          <CommandGroup>
            {data.map((val) => (
              <CommandItem
                key={val.place_id}
                value={val.description}
                onSelect={() => onSelectSuggestion(val)}
                className={cn(
                  "my-1 w-full flex-col items-start gap-1",
                  !fetchingPlaceId &&
                    selectedPlace?.placeId === val.place_id &&
                    "bg-accent text-accent-foreground",
                )}
                disabled={!!fetchingPlaceId || !!selectedPlace}
              >
                <div className="inline-flex w-full items-center gap-2">
                  {val.structured_formatting.main_text}
                  {fetchingPlaceId === val.place_id && (
                    <Spinner className="ml-auto size-5" />
                  )}
                  {!fetchingPlaceId &&
                    selectedPlace?.placeId === val.place_id && (
                      <Check className="ml-auto size-8 font-extrabold" />
                    )}
                </div>

                <span className="text-xs font-extralight">
                  {val.structured_formatting.secondary_text}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};
