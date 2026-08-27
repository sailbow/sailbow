"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Search, Loader2, X } from "lucide-react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "./ui/toast";
import usePlacesAutocomplete, {
  getDetails,
  Suggestion,
} from "use-places-autocomplete";
import z from "zod";
import { useEffect, useState } from "react";
import { env } from "@/env";

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

type GooglePlaceSearchProps = {
  onSelect: (place: GooglePlaceResult | undefined) => void;
  defaultPlace?: GooglePlaceLite;
  className?: string;
  clearOnSelect?: boolean;
  disabled?: boolean;
  placeholder?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
};

type GooglePlaceLite = {
  placeId: string;
  primaryText: string;
  secondaryText?: string;
};

export function GoogleLocationSearch({
  onSelect,
  defaultPlace,
  className,
  clearOnSelect,
  disabled,
  placeholder,
  ref,
  autoFocus,
}: GooglePlaceSearchProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const {
    init,
    ready,
    setValue,
    value,
    suggestions: { data, loading, status },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const [fetchingPlaceId, setFetchingPlaceId] = useState<string | undefined>(
    undefined,
  );

  const [selectedPlace, setSelectedPlace] = useState(defaultPlace);

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(
    data.findIndex((v) => v.place_id === defaultPlace?.placeId) ?? -1,
  );
  const internalInputRef = React.useRef<HTMLInputElement>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const inputRef = ref ?? internalInputRef;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setIsOpen(true);
  }, [data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < data.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && data[highlightedIndex]) {
          onSelectSuggestion(data[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

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
          inputRef.current?.blur();
          setTimeout(clearSuggestions, 200);
        } else {
          setSelectedPlace(result);
        }
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong selecting a location");
      })
      .finally(() => {
        setFetchingPlaceId(undefined);
      });
  };

  const isReady = isLoaded && ready;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {selectedPlace && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {selectedPlace.primaryText}
            </p>
            {selectedPlace.secondaryText && (
              <p className="text-xs text-muted-foreground">
                {selectedPlace.secondaryText}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedPlace(undefined);
              onSelect(undefined);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            disabled={disabled}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {!selectedPlace && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {loading || !!fetchingPlaceId || !isReady ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => {
              setHighlightedIndex(-1);
              setValue(e.target.value);
              setSelectedPlace(undefined);
            }}
            onFocus={() => {
              inputRef.current?.select();
              if (data?.length) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Search for a place, address, etc.'}
            disabled={disabled ?? Boolean(fetchingPlaceId)}
            className={cn(
              "h-11 w-full rounded-lg max-xs:text-base border border-input bg-background pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
            )}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="location-listbox"
            aria-autocomplete="list"
          />
        </div>
      )}
      {/* Dropdown Results */}
      {isOpen && data.length > 0 && (
        <ul
          ref={listRef}
          id="location-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {data.map((location, index) => {
            const isSelected =
              selectedPlace && selectedPlace.placeId === location.place_id;
            return (
              <li
                key={location.place_id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSuggestion(location)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
                  !!isSelected || highlightedIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {location.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {location.structured_formatting.secondary_text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* No Results Message */}
      {isOpen && value && status === "ZERO_RESULTS" && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover p-4 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">
            No locations found for &quot;{value}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
