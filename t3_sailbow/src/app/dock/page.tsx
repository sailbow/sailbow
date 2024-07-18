"use client";
import TripCard from "../_components/trip-card";
import ErrorPage from "../_components/error-page";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import CenteredSpinner from "../_components/centered-spinner";

export default function Page() {
  const trips = useQuery(api.trips.queries.getUserTrips);
  if (trips === undefined) return <CenteredSpinner />;
  return (
    <div className="relative mx-auto h-full max-w-6xl overflow-y-auto xs:container">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-background p-4">
        <div className="text-xl font-medium leading-none tracking-tight">
          Boats
        </div>
        <Link
          href="/dock/new"
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
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          trips.map((boat) => {
            return <TripCard key={boat?._id} trip={boat} />;
          })
        }
      </div>
    </div>
  );
}
