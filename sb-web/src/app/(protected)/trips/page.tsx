"use client";
import TripCard from "@/app/_components/trip-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserTrips } from "@/lib/trip-queries";
import { CreateTripButton } from "./create-trip-button";

export default function TripsPage() {
  const { data: trips, isPending } = useUserTrips();

  return (
    <div className="container relative mx-auto min-h-dvh">
      <div className="container sticky top-0 z-50 mx-auto flex min-h-12 items-center justify-between bg-background py-3">
        <div className="inline-flex break-normal text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
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
