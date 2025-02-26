"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/use-debounce";
import { Check, ChevronsUpDown, Sailboat } from "lucide-react";
import { type ChangeEvent, useState, useEffect, useMemo } from "react";
import CenteredSpinner from "./centered-spinner";
import Link from "next/link";
import { type Route } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useActiveTripId,
  useSearchTrips,
  useActiveTrip,
} from "@/lib/trip-queries";
import { type Doc } from "@convex/_generated/dataModel";
import ImageWithLoader from "./image-with-loader";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const TripDropdownItem = ({ trip }: { trip: Doc<"trips"> }) => {
  const activeTripId = useActiveTripId();
  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {!!trip.banner ? (
          <ImageWithLoader src={trip.banner.thumbnail} alt={trip.banner.alt} />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-r from-blue-300 via-accent to-blue-300">
            <Sailboat
              className="size-10 stroke-muted-foreground"
              strokeWidth={1}
            />
          </div>
        )}
      </div>
      <div className="text-sm font-light">{trip.name}</div>
      <div className="ml-auto">
        {activeTripId === trip._id && (
          <Check className="size-6 stroke-green-500" />
        )}
      </div>
    </div>
  );
};

export default function TripSearch() {
  const { data: trip } = useActiveTrip();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebounce(searchTerm, 500);
  const { isFetching, data: trips } = useSearchTrips(query);
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const tripResults = useMemo(() => {
    return trips?.filter((t) => t._id !== trip?._id);
  }, [trip?._id, trips]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  if (!trip) return;
  return (
    <SidebarMenuItem>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg" className="gap-4">
            <span className="mr-2 truncate font-semibold">{trip.name}</span>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <div className="flex flex-col bg-card">
            <div className="p-2">
              <Input
                autoFocus={!isMobile}
                type="search"
                placeholder="Search..."
                className="rounded-lg"
                onChange={onSearchChange}
              />
            </div>
            <DropdownMenuLabel className="font-light">
              Active trip
            </DropdownMenuLabel>
            <div
              className="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => setIsOpen(false)}
            >
              <TripDropdownItem trip={trip} />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-light">
              Other trips
            </DropdownMenuLabel>
            {isFetching ? (
              <CenteredSpinner />
            ) : tripResults?.length === 0 ? (
              <div className="w-full text-center text-sm text-muted-foreground">
                No trips were found
              </div>
            ) : (
              <ScrollArea className="min-h-8">
                <DropdownMenuGroup className="max-h-[50dvh] overflow-y-auto">
                  {tripResults
                    ?.filter((t) => t._id !== trip._id)
                    .map((t) => (
                      <Link
                        key={t._id}
                        href={`/trips/${t._id}` as Route}
                        onClick={() => {
                          if (isMobile) {
                            toggleSidebar();
                          }
                        }}
                      >
                        <div
                          className="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <TripDropdownItem trip={t} />
                        </div>
                      </Link>
                    ))}
                </DropdownMenuGroup>
              </ScrollArea>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
