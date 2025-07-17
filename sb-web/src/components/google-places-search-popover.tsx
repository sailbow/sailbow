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

type GooglePlaceResult = z.infer<typeof GooglePlaceResultSchema>;

export const GooglePlacesSearchPopover = ({
  onSelect,
  trigger,
}: {
  onSelect: (place: GooglePlaceResult) => void;
  trigger: React.ReactElement;
}) => {
  const {
    ready,
    setValue,
    suggestions: { status, data, loading },
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: true,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const popoverDisclosure = useDisclosure();

  const [fetchingPlaceId, setFetchingPlaceId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setTimeout(
      () => {
        clearSuggestions();
      },
      popoverDisclosure.open ? 0 : 200,
    );
  }, [popoverDisclosure.open, clearSuggestions]);

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
      ],
    })
      .then((details) => {
        if (typeof details !== "object")
          throw new Error("Cannot parse google places search result");
        const result: GooglePlaceResult = {
          placeId: value.place_id,
          primaryText: value.structured_formatting.main_text,
          secondaryText: value.structured_formatting.secondary_text,
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
        popoverDisclosure.setClosed();
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
    <Popover {...popoverDisclosure}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-md p-0">
        <Command className="min-h-24">
          <CommandInput
            placeholder="e.g. Paris"
            disabled={!!fetchingPlaceId}
            onChangeCapture={(e) => setValue(e.currentTarget.value)}
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
                    className="w-full flex-col items-start gap-1"
                    disabled={!!fetchingPlaceId}
                  >
                    <div className="inline-flex w-full items-center gap-2">
                      {val.structured_formatting.main_text}
                      {fetchingPlaceId === val.place_id && (
                        <Spinner className="ml-auto size-4" />
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
      </PopoverContent>
    </Popover>
  );
};
