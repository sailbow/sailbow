"use client";
import BannerModal from "@/app/_components/banner-modal";
import { toast } from "@/components/ui/toast";
import { useUpdateBanner } from "@/lib/trip-mutations";
import { useActiveTrip, useActiveTripId } from "@/lib/trip-queries";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

export default function TripBannerModal() {
  const tripId = useActiveTripId();
  const update = useMutation(
    api.trips.mutations.updateTripBanner,
  ).withOptimisticUpdate((store, args) => {
    const existing = store.getQuery(api.trips.queries.getById, { tripId });
    if (existing) {
      store.setQuery(
        api.trips.queries.getById,
        { tripId },
        {
          ...existing,
          banner: args.banner,
        },
      );
    }
  });

  const { data: trip } = useActiveTrip();

  if (!trip) return;

  return (
    <BannerModal
      onBannerChange={(banner) => {
        update({ tripId, banner })
          .then(() => {
            toast.success(
              `Cover photo ${!!banner ? "updated" : "removed"} successfully!`,
            );
          })
          .catch((err) => {
            console.error(err);
            toast.error("Something went wrong there");
          });
      }}
      variant={trip.banner ? "edit" : "add"}
    />
  );
}
