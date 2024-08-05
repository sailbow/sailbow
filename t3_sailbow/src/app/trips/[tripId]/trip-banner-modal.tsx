"use client";
import BannerModal from "@/app/_components/banner-modal";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

export default function TripBannerModal({ tripId }: { tripId: Id<"trips"> }) {
  const updateBanner = useMutation(api.trips.mutations.updateTripBanner);
  return (
    <BannerModal
      onBannerChange={(banner) => updateBanner({ tripId, banner })}
    />
  );
}
