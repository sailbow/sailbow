"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/use-debounce";
import { Check, ChevronsUpDown, Sailboat } from "lucide-react";
import { type ChangeEvent, useState, useEffect } from "react";
import CenteredSpinner from "./centered-spinner";
import Link from "next/link";
import { type Route } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActiveTripId, useSearchTrips, useTrip } from "@/lib/trip-queries";
import { Doc } from "@convex/_generated/dataModel";
import Image from "next/image";
import ImageWithLoader from "./image-with-loader";

const TripDropdownItem = ({ trip }: { trip: Doc<"trips"> }) => {
  const activeTripId = useActiveTripId();
  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex h-12 w-20 shrink-0 items-center overflow-hidden rounded-md">
        {!!trip.banner ? (
          <ImageWithLoader src={trip.banner.thumbnail} alt={trip.banner.alt} />
        ) : (
          <Sailboat
            className="size-10 stroke-muted-foreground"
            strokeWidth={1}
          />
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
  const { data: trip } = useTrip();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebounce(searchTerm, 500);
  const { isFetching, data: trips } = useSearchTrips(query);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    // e.preventDefault();
    setSearchTerm(e.target.value);
  };

  if (!trip) return;
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start">
          <span className="max-w-[250px] overflow-hidden text-ellipsis">
            {trip.name}
          </span>
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <div className="flex flex-col space-y-2 bg-popover">
          <div className="p-2">
            <Input
              type="search"
              placeholder="Search..."
              className="rounded-lg"
              onChange={onSearchChange}
            />
          </div>

          <div
            className="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <TripDropdownItem trip={trip} />
          </div>
          <DropdownMenuSeparator />
          {isFetching ? (
            <CenteredSpinner />
          ) : trips?.length === 0 ? (
            <div className="w-full text-center text-sm text-muted-foreground">
              No trips were found
            </div>
          ) : (
            <ScrollArea>
              <DropdownMenuGroup className="max-h-[50dvh] overflow-y-auto">
                {trips
                  ?.filter((t) => t._id !== trip._id)
                  .map((t) => (
                    <Link key={t._id} href={`/trips/${t._id}` as Route}>
                      <DropdownMenuItem>
                        <TripDropdownItem trip={t} />
                      </DropdownMenuItem>
                    </Link>
                  ))}
              </DropdownMenuGroup>
            </ScrollArea>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
