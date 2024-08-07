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
import { ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useState, useEffect } from "react";
import CenteredSpinner from "./centered-spinner";
import Link from "next/link";
import { type Route } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useTrip } from "@/lib/trip-queries";

export default function TripSearch() {
  const { data: trip } = useTrip();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebounce(searchTerm, 500);
  const { isFetching, data: trips } = useQuery({
    ...convexQuery(api.trips.queries.searchTrips, { text: query }),
    enabled: query !== "",
  });

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start">
          <span className="max-w-[250px] overflow-hidden text-ellipsis">
            {trip.name}
          </span>
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <div className="flex flex-col space-y-3 bg-popover p-2">
          <Input
            autoFocus
            type="search"
            placeholder="Search..."
            className="rounded-lg"
            onChange={onSearchChange}
          />
          <DropdownMenuSeparator />
        </div>
        {isFetching ? (
          <CenteredSpinner />
        ) : trips?.length === 0 ? (
          <div className="w-full text-center text-sm text-muted-foreground">
            No trips were found
          </div>
        ) : (
          <ScrollArea>
            <DropdownMenuGroup className="max-h-[50dvh] overflow-y-auto">
              {trips?.map((t) => (
                <Link key={t._id} href={`/trips/${t._id}` as Route}>
                  <DropdownMenuItem className="space-x-2">
                    {t.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
