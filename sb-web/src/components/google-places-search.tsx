"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import { env } from "@/env";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useDisclosure } from "@/lib/use-disclosure";
import { Button } from "./ui/button";
import { LocationEdit } from "lucide-react";
import { useEffect, useState } from "react";

export const GooglePlacesSearch = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <CenteredSpinner />;

  return <PlacesAutoComplete />;
};

const PlacesAutoComplete = ({}) => {
  const {
    ready,
    setValue,
    suggestions: { status, data, loading },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const popoverDisclosure = useDisclosure();
  const [selectedValue, setSelectedValue] = useState<
    { name: string; address: string } | undefined
  >();

  useEffect(() => {
    clearSuggestions();
  }, [popoverDisclosure.open]);

  return (
    <Popover {...popoverDisclosure}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <LocationEdit className="mr-2 size-4" />
          <span className="max-w-[200px] text-wrap text-left">
            {selectedValue ? selectedValue.name : "Set a location"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-md p-0">
        <Command className="min-h-24">
          <CommandInput
            placeholder="e.g. Paris"
            disabled={!ready}
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
                    onSelect={() => {
                      setSelectedValue({
                        name: val.structured_formatting.main_text,
                        address: val.structured_formatting.secondary_text,
                      });
                      popoverDisclosure.setClosed();
                    }}
                  >
                    {val.description}
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
