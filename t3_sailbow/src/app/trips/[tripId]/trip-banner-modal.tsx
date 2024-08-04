"use client";
import BannerModal from "@/app/_components/banner-modal";
import { useConvexQuery } from "@/lib/convex-client-helpers";
import { useTrip } from "@/lib/use-trip";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

export default function TripBannerModal({ tripId }: { tripId: Id<"trips"> }) {
  const { isLoading } = useTrip;
  const updateBanner = useMutation(api.trips.mutations.updateTripBanner);
  if (isLoading) return;
  return (
    <BannerModal
      onBannerChange={(banner) => updateBanner({ tripId, banner })}
    />
  );
}
