"use client";
import TripCard from "@/app/_components/trip-card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserTrips } from "@/lib/trip-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useIsXs } from "@/hooks/use-media-query";

const CreateTripButton = () => {
  const isXs = useIsXs();
  return (
    <Link
      href="/trips/new"
      className={cn(
        buttonVariants({ size: isXs ? "sm" : "default" }),
        "max-xs:size-10 max-xs:rounded-full",
      )}
    >
      <Plus className="h-6 w-6 xs:mr-2" />
      <span className="hidden xs:inline-flex">Create a trip</span>
    </Link>
  );
};

export default function TripsPage() {
  const { data: trips, isPending } = useUserTrips();

  return (
    <div className="relative mx-auto h-full max-w-6xl overflow-y-auto xs:container">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-background p-4">
        <div className="text-xl font-medium leading-none tracking-tight">
          Trips
        </div>
        <CreateTripButton />
      </div>
      {isPending && (
        <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-[250px] overflow-hidden">
              <Skeleton className="size-full bg-slate-300" />
            </Card>
          ))}
        </div>
      )}
      {!isPending && !!trips && trips.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <Card className="mt-4 flex h-[50dvh] w-full flex-col items-center justify-center gap-10 p-4">
            <h3 className="text-2xl leading-none tracking-tight">
              No trips created yet!
            </h3>
            <CreateTripButton />
          </Card>
        </div>
      )}
      {!isPending && !!trips && (
        <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip?._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
