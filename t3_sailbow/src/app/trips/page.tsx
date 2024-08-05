"use client";
import TripCard from "../_components/trip-card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserTrips } from "@/lib/use-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Page() {
  const { data: trips, isPending } = useUserTrips();
  return (
    <div className="relative mx-auto h-full max-w-6xl overflow-y-auto xs:container">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-background p-4">
        <div className="text-xl font-medium leading-none tracking-tight">
          Trips
        </div>
        <Link
          href="/trips/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "max-xs:size-10 max-xs:rounded-full",
          )}
        >
          <Plus className="h-6 w-6 xs:mr-2" />
          <span className="hidden xs:inline-flex">Create a boat</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-[250px] overflow-hidden">
                <Skeleton className="size-full bg-slate-300" />
              </Card>
            ))
          : trips?.map((boat) => <TripCard key={boat?._id} trip={boat} />)}
      </div>
    </div>
  );
}
